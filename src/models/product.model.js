const { Schema, model } = require("mongoose");

const productSchema = new Schema({
  name: String,
  description: String,
  price: Number,
  code: {
    type: Number,
    index: true,
  },
  status: Boolean,
  stock: Number,
  category: String,
  thumbnail: {
    type: String,
    default: "",
  },
});

module.exports = model("Product", productSchema);
