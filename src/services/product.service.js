const Product = require("../models/product.model");

const isValidObjectId = require("../utils/isValidObjectId.js");

const productCodeErrors = {
  INVALID_FORMAT: "invalid product id format",
  NOT_FOUND: "not found",

};

const getAllProducts = async () => {
  const products = await Product.find();

  if(products.length === 0) {
    throw new Error(productCodeErrors.NOT_FOUND);
  }

  return products;
};

const getProductById = async (id) => {
  if (!isValidObjectId(id)) {
    throw new Error(productCodeErrors.INVALID_FORMAT);
  }

  const product = await Product.findById(id);

  if (!product) {
    throw new Error(productCodeErrors.NOT_FOUND);
  }

  return product;
};

const createProduct = async (data) => {
  const productRequest = new Product(data);

  return await productRequest.save();
};

module.exports = { getAllProducts, getProductById, createProduct, productCodeErrors };