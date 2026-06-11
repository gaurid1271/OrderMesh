const Order = require("../models/Order");

// CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const order = await Order.create(req.body);

    const io = req.app.get("io");

    if (io) {
      io.emit("newOrder", order);
    }

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL ORDERS
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({
      created_at: -1,
    });

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE STATUS
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      {
        new: true,
      }
    );

    const io = req.app.get("io");

    if (io) {
      io.emit("statusUpdated", order);
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE ORDER
exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Order Deleted Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DASHBOARD STATS
exports.getDashboardStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();

    const completedOrders = await Order.countDocuments({
      status: "COMPLETED",
    });

    const revenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$total_amount",
          },
        },
      },
    ]);

    const stores = await Order.distinct("store_id");

    res.status(200).json({
      success: true,
      totalOrders,
      completedOrders,
      totalRevenue:
        revenueResult.length > 0
          ? revenueResult[0].totalRevenue
          : 0,
      storesCount: stores.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ORDERS PER DAY
exports.getOrdersPerDay = async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$created_at",
            },
          },
          orders: {
            $sum: 1,
          },
        },
      },
      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// REVENUE PER STORE
exports.getRevenuePerStore = async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $group: {
          _id: "$store_id",
          revenue: {
            $sum: "$total_amount",
          },
        },
      },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// TOP ITEMS
exports.getTopItems = async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $unwind: "$items",
      },
      {
        $group: {
          _id: "$items.name",
          quantity: {
            $sum: "$items.qty",
          },
        },
      },
      {
        $sort: {
          quantity: -1,
        },
      },
      {
        $limit: 5,
      },
    ]);

    res.json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};