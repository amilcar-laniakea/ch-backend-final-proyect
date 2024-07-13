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
  if (!isValidObjectId(id)) {
    throw new Error(productErrorCodes.INVALID_FORMAT);
  }

  const product = await Product.findById(id);

  if (!product) {
    throw new Error(productErrorCodes.NOT_FOUND);
  }

  return product;
};

const createProduct = async (data) => {
  const productRequest = new Product(data);

  return await productRequest.save();
};

const updateProduct = async (id, data) => {
  const product = await Product.findByIdAndUpdate(id, data);

  if (!product) {
    throw new Error(productErrorCodes.NOT_FOUND);
  }

  return product;
}

const deleteProduct = async (id) => {
  const product = await Product.findByIdAndDelete(id);

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