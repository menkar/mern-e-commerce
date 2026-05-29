const Order = require("../models/Order.model");
const Product = require("../models/Product.model");
const { sendEmail } = require("../utils/sendEmail");
const { buildOrderConfirmationEmail } = require("../utils/orderEmailTemplate");

const reserveOrderStock = async (items) => {
    for (const item of items) {
        const product = await Product.findById(item.productId).select('name stock');

        if (!product) {
            return {
                ok: false,
                message: 'One or more products in your order are no longer available.',
            };
        }

        if (product.stock < item.qty) {
            const unitLabel = product.stock === 1 ? 'unit' : 'units';
            const availableText = product.stock <= 0
                ? 'is currently out of stock'
                : `has only ${product.stock} ${unitLabel} left`;

            return {
                ok: false,
                message: `${product.name} ${availableText}. Please update your cart.`,
            };
        }
    }

    for (const item of items) {
        const updated = await Product.findOneAndUpdate(
            { _id: item.productId, stock: { $gte: item.qty } },
            { $inc: { stock: -item.qty } },
            { new: true }
        );

        if (!updated) {
            const product = await Product.findById(item.productId).select('name stock');
            const availableText = !product || product.stock <= 0
                ? 'is currently out of stock'
                : `has only ${product.stock} units left`;

            return {
                ok: false,
                message: `${product?.name || 'A product'} ${availableText}. Please update your cart.`,
            };
        }
    }

    return { ok: true };
};

const createOrder = async (req, res) => {
    try {
        const {items, totalAmount, address, paymentId } = req.body;
        if (!items || items.length === 0 || !totalAmount || !address ) {
            return res.status(400).json({message: "Invalid order data"});
        }

        const stockResult = await reserveOrderStock(items);
        if (!stockResult.ok) {
            return res.status(400).json({ message: stockResult.message });
        }

        const order = new Order({
            user: req.user._id,
            items,
            totalAmount,
            address,
            paymentId
        });
        await order.save();

        const populatedOrder = await Order.findById(order._id).populate('items.productId', 'name');
        const emailContent = buildOrderConfirmationEmail({
            user: req.user,
            order: populatedOrder,
        });

        await sendEmail(
            req.user.email,
            emailContent.subject,
            emailContent.text,
            emailContent.html
        );
        return res.status(201).json({ message: 'Order created successfully', order });
    } catch(error) {
        //console.error(error);
        res.status(500).json({message: 'Error creating order'});
    }

};

const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({user: req.user._id})
            .populate('items.productId', 'name price')
            .sort({ createdAt: -1 });
        res.status(200).json({orders});
    } catch(error) {
        res.status(500).json({message: "Error fetching orders", error});
    }
};

const getOrders = async (req, res) => {
    try {
         const orders = await Order.find({})
            .populate('user', 'name email')
            .populate('items.productId', 'name price')
            .sort({ createdAt: -1 });
        res.status(200).json({orders});
    } catch(error) {
        res.status(500).json({message: "Error fetching orders", error});
    }
}

const updateOrderStatus = async (req, res) => {
    try {
        const {status} = req.body;
        const order = await Order.findById(req.params.id);
        if (order) {
            const normalized = (status || 'pending').toLowerCase();
            const allowed = ['pending', 'shipped', 'delivered'];
            order.status = allowed.includes(normalized) ? normalized : 'pending';
            await order.save();
            res.status(200).json({message: "Order status updated", order});
        } else {
            res.status(500).json({message: "Order not found"});
        }
    } catch(error) {
        res.status(500).json({message: 'Error updating order status'});
    }
};



module.exports = {
    createOrder,
    getMyOrders,
    getOrders,
    updateOrderStatus
}