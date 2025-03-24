const Product = require('../models/product');
const Order = require('../models/order');
const User = require('../models/user');
const Category = require('../models/category');

exports.getTotalProducts = async (req, res, next) => {
    try {
        const totalProducts = await Product.countDocuments();
        res.status(200).json({ totalProducts });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTotalCategories = async (req, res, next) => {
    try {
        const totalCategories = await Category.countDocuments();
        res.status(200).json({ totalCategories });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTotalOrders = async (req, res, next) => {
    try {
        const totalOrders = await Order.countDocuments();
        res.status(200).json({ totalOrders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getOrdersToday = async (req, res, next) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const ordersToday = await Order.find({ createdAt: { $gte: today } }).populate('user');
        res.status(200).json({ ordersToday });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getLatestCustomers = async (req, res, next) => {
    try {
        const latestCustomers = await User.find().sort({ createdAt: -1 }).limit(10);
        res.status(200).json({ latestCustomers });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTotalEarnings = async (req, res, next) => {
    try {
        const totalEarnings = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$totalPrice" } } }
        ]);
        res.status(200).json({ totalEarnings: totalEarnings[0].total });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getTopCategories = async (req, res, next) => {
    try {
        const topCategories = await Product.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);
        res.status(200).json({ topCategories });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

