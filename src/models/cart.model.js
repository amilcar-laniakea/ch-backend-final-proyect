const { Schema, model } = require("mongoose");

const cartSchema = new Schema({
  status: String,
  products: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: Number,
    },
  ],
});

module.exports = model("Cart", cartSchema);
