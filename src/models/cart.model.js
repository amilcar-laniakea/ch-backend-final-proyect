const { Schema, model } = require("mongoose");

const cartSchema = new Schema({
  status: {
    type: Boolean,
    required: true,
    default: true, 
  },
  products: [
    {
      id: {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: {
        type: Number,
      },
    },
  ],
}, { timestamps: true });

module.exports = model("carts", cartSchema);
