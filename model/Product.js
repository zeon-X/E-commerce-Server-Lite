const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        decs: { type: String },
        img: { type: String },
        imgArray: { type: Array },
        categories: { type: Array },
        size: { type: String },
        color: { type: String },
        price: { type: Number, required: true },
        quantity: { type: Number }
    },
    { timestamps: true }
)

module.exports = mongoose.model("Product", ProductSchema);