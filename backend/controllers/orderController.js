const Order = require("../models/Order.model");
const { sendEmail } = require("../utils/sendEmail");


const createOrder = async (req, res) => {
    try {
        const {items, totalAmount, address, paymentId } = req.body;
        if (!items || items.length === 0 || !totalAmount || !address ) {
            return res.status(400).json({message: "Invalid order data"});
        } else {
            const order = new Order({
                user: req.user._id,
                items,
                totalAmount,
                address,
                paymentId
            });
            await order.save();

            const orderItemsText = order.items.map((item, index) =>
                `${index + 1}. Product ID: ${item.productId} | Qty: ${item.qty} | Price: ₹${item.price.toFixed(2)}`
            ).join("\n");

            const shippingAddressText = `${order.address.fullName}\n${order.address.street}\n${order.address.city}, ${order.address.postalCode}\n${order.address.country}`;

            const message = `Dear ${req.user.name},\n\n` +
                `Thank you for your order. We have received your purchase and your order is now being processed. Below are the details of your order:\n\n` +
                `Order Summary:\n` +
                `Order ID: ${order._id}\n` +
                `Payment ID: ${order.paymentId || 'N/A'}\n` +
                `Total Amount: ₹${order.totalAmount.toFixed(2)}\n\n` +
                `Items:\n${orderItemsText}\n\n` +
                `Shipping Address:\n${shippingAddressText}\n\n` +
                `If you have any questions about your order, please reply to this email or contact our support team.\n\n` +
                `Thank you for choosing us.\n\n` +
                `Best regards,\n` +
                `Customer Service Team` +
                `Swap Ecommerce Store` ;

            await sendEmail(req.user.email, `Order Confirmation - ${order._id}`, message);
            return res.status(201).json({ message: 'Order created successfully', order });
        }

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