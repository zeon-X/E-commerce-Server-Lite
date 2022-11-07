const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    img: { type: String },
    imgArray: { type: Array },
    categories: { type: Array },
    price: { type: Number, required: true },
    discount_Price: { type: Number },
    quantity: { type: Number },
    status: {
      type: String,
      default: "active",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
