const Order = require("../models/Order.model");
const Product = require("../models/Product.model");
const User = require("../models/User.model");

const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({role: 'user'});
        const totalOrders = await Order.countDocuments({});
        const totalProducts = await Product.countDocuments({});

        const orders = await Order.find({});

        const totalRevenueData = orders.reduce((total, order) => total + order.totalAmount,0);

        res.json({
            totalUsers,
            totalOrders,
            totalProducts,
            totalRevenue: totalRevenueData
        });

    } catch(error) {
        res.status(500).json({message: "Error fetching stats", error});
    }
};

module.exports = {
    getAdminStats
}