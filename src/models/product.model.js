const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  code: {
    type: Number,
    index: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    default: "",
  },
});

module.exports = model("Product", productSchema);
