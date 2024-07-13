const { Schema, model } = require("mongoose");

const cartSchema = new Schema({
  status: {
    type: Boolean,
    default: true, 
  },
  products: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: "Product",
        required: true
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

module.exports = model("Cart", cartSchema);
