const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  store_id: {
    type: String,
    required: true,
  },

  items: [
    {
      item_id: String,
      name: String,
      qty: Number,
      price: Number,
    },
  ],

  total_amount: {
    type: Number,
    required: true,
  },

  status: {
    type: String,
    enum: ["PLACED", "PREPARING", "COMPLETED"],
    default: "PLACED",
  },

  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);