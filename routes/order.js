const express = require("express");
const {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderStatus,
  getAllOrders,
} = require("../controllers/orderController");
const { isAuthenticatedUser, authorizeRoles } = require("../middlewares/auth");

const router = express.Router();

router.post("/order", isAuthenticatedUser, createOrder);
router.get("/order/:id", isAuthenticatedUser, getOrderById);
router.get("/my-orders", isAuthenticatedUser, getMyOrders);
router.put("/order/:id/status", isAuthenticatedUser, updateOrderStatus);
router.get(
  "/admin/orders",
  isAuthenticatedUser,
  authorizeRoles("admin"),
  getAllOrders
);

module.exports = router;
