const Product = require("../models/product.model");
const isValidObjectId = require("../utils/isValidObjectId.js");
const { productErrorCodes } = require("../constants/product.constants.js")

const getAllProducts = async () => {
  const products = await Product.find();

  if(products.length === 0) {
    throw new Error(productErrorCodes.NOT_FOUND);
  }

  return products;
};

const getProductById = async (id) => {
  if (!isValidObjectId(id) && isNaN(Number(id))) {
    throw new Error(productErrorCodes.INVALID_FORMAT);
  }

  const product = await ( !isNaN(id) ? Product.findOne({ code: id}) : Product.findById(id));

  if (!product) {
    throw new Error(productErrorCodes.NOT_FOUND);
  }

  return product;
};

const createProduct = async (data) => {
  const productRequest = new Product(data);
  const product = await productRequest.save();

  if (!product) {
    throw new Error(productErrorCodes.UNEXPECTED_ERROR);
  }

  return product;
};

const updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(id, data);

  if (!product) {
    throw new Error(productErrorCodes.NOT_FOUND);
  }

  return product;
}

const deleteProduct = async (id) => {
  if (!isValidObjectId(id) && isNaN(Number(id))) {
    throw new Error(productErrorCodes.INVALID_FORMAT);
  }
  
  const product = await ( !isNaN(id) ? Product.deleteOne({ code: id }) : Product.findByIdAndDelete(id));

  if (!product) {
    throw new Error(productErrorCodes.NOT_FOUND);
  }

  return product;
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};