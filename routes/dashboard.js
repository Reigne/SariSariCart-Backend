const express = require('express');
const {
    getTotalProducts,
    getTotalCategories,
    getTotalOrders,
    getOrdersToday,
    getLatestCustomers,
    getTotalEarnings,
    getTopCategories
} = require('../controllers/dasboardController');
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');

const router = express.Router();

router.get('/total-products', isAuthenticatedUser, authorizeRoles('admin'), getTotalProducts);
router.get('/total-categories', isAuthenticatedUser, authorizeRoles('admin'), getTotalCategories);
router.get('/total-orders', isAuthenticatedUser, authorizeRoles('admin'), getTotalOrders);
router.get('/orders-today', isAuthenticatedUser, authorizeRoles('admin'), getOrdersToday);
router.get('/latest-customers', isAuthenticatedUser, authorizeRoles('admin'), getLatestCustomers);
router.get('/total-earnings', isAuthenticatedUser, authorizeRoles('admin'), getTotalEarnings);
router.get('/top-categories', isAuthenticatedUser, authorizeRoles('admin'), getTopCategories);

module.exports = router;
