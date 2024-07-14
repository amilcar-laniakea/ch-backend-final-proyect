const Cart = require('../models/cart.model');
const isValidObjectId = require("../utils/isValidObjectId.js");
const { cartErrorCodes } = require('../constants/cart.constants.js');

const getAllCarts = async () => {
  const carts = await Cart.find();

  if (carts.length === 0) {
    throw new Error(cartErrorCodes.NOT_FOUND);
  }

  return carts;
};

const getCartById = async (id) => {
  if (!isValidObjectId(id)) {
    throw new Error(cartErrorCodes.INVALID_FORMAT);
  }

  const cart = await Cart.findById(id);

  if (!cart) {
    throw new Error(cartErrorCodes.NOT_FOUND);
  }

  return cart;
};

const createCart = async () => {
  const cart = new Cart();
  const cartSaved = await cart.save();

  if(!cartSaved) {
    throw new Error(cartErrorCodes.UNEXPECTED_ERROR);
  }

  return cartSaved;
}; 

const deleteCart = async (id) => {
  if (!isValidObjectId(id)) {
    throw new Error(cartErrorCodes.INVALID_FORMAT);
  }

  const cart = await Cart.findByIdAndDelete(id);

  if (!cart) {
    throw new Error(cartErrorCodes.NOT_FOUND);
  }

  return cart;
};

module.exports = { getAllCarts, getCartById, createCart, deleteCart };