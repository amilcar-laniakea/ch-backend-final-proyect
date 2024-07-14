const { productErrorCodes, productSuccessCodes } = require("../constants/product.constants.js");
const { exceptionErrors } = require("../constants/general.constants.js");
const { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../services/product.service.js");
const { statusResponse } = require("../utils/response.js");

class ProductController {
  constructor() {
    this.products = [];
  }

  async getProducts(res, limit) {
    try {
      let limitParam = parseInt(limit);
      this.products = await getAllProducts();
      let limitProducts = [...this.products];

      if (!isNaN(limitParam) && limitParam > 0) {
        limitProducts = this.products.slice(0, limitParam);
      }

      return statusResponse(res, limitProducts);
    } catch (error) {
      if (error.message === productErrorCodes.NOT_FOUND) {
        return statusResponse(res, null, error.message, 404, false);
      }

      return statusResponse(res, null, error.message, 500, false);
    }
  }

  async getProductById(res, id) {
    try {
      this.products = await getProductById(id);

      return statusResponse(res, this.products);
    } catch (error) {
      if (error.message === productErrorCodes.INVALID_FORMAT) {
        return statusResponse(res, null, error.message, 400, false);
      }

      if (error.message === productErrorCodes.NOT_FOUND) {
        return statusResponse(res, null, error.message, 404, false);
      }

      return statusResponse(res, null, error.message, 500, false);
    }
  }

  async createProduct(
    res,
    { name, description, price, code, status, stock, category, thumbnail = "" }
  ) {
    try {
      const product = {
        name,
        description,
        price,
        code,
        status,
        stock,
        category,
        thumbnail,
      };

      const response = await createProduct(product);

      return statusResponse(res, response, productSuccessCodes.SUCCESS_CREATE, 201);
    } catch (error) {
      if (
        error.name === exceptionErrors.VALIDATION_ERROR ||
        error.message === productErrorCodes.UNEXPECTED_ERROR ||
        error.errorResponse.code === 11000
      ) {
        return statusResponse(res, null, error.message, 400, false);
      }

      return statusResponse(res, null, error.message, 500, false);
    }
  }

  async updateProduct(
    res,
    id,
    { name, description, price, code, status, stock, category, thumbnail }
  ) {
    try {
      const product = {
        name,
        description,
        price,
        code,
        status,
        stock,
        category,
        thumbnail,
      };

      const productUpdate = await updateProduct(id, product);

      return statusResponse(
        res,
        { ...productUpdate._doc,  ...product },
        productSuccessCodes.SUCCESS_UPDATE,
        200
      );
    } catch (error) {     
      if (error.message === productErrorCodes.NOT_FOUND) {
        return statusResponse(res, null, error.message, 404, false);
      }

      if (error.name === exceptionErrors.CAST_ERROR) {
        return statusResponse(res, null, error.message, 400, false);
      }

      return statusResponse(res, null, error.message, 500, false);
    }
  }

  async deleteProduct(res, id) {
    try {
      this.products = await deleteProduct(id);
      
      return statusResponse(res, this.products, productSuccessCodes.SUCCESS_DELETE,  200);
    } catch(error) {
      if (error.message === productErrorCodes.NOT_FOUND) {
        return statusResponse(res, null, error.message, 404, false);
      }

      if(error.name === exceptionErrors.CAST_ERROR) {
        return statusResponse(res, null, error.message, 400, false);
      }

      return statusResponse(res, null, error.message, 500, false);
    }
  }
}

module.exports = ProductController;