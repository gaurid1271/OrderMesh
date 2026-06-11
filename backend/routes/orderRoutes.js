const express = require("express");

const router = express.Router();

const {
  createOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder,
  getDashboardStats,
  getOrdersPerDay,
  getRevenuePerStore,
  getTopItems,
} = require("../controllers/orderController");

// Orders
router.post("/", createOrder);

router.get("/", getOrders);

router.patch("/:id/status", updateOrderStatus);

router.delete("/:id", deleteOrder);

// Dashboard
router.get(
  "/dashboard/stats",
  getDashboardStats
);

// Analytics
router.get(
  "/analytics/orders-per-day",
  getOrdersPerDay
);

router.get(
  "/analytics/revenue-per-store",
  getRevenuePerStore
);

router.get(
  "/analytics/top-items",
  getTopItems
);

module.exports = router;