const {
  getAllCarts,
  getCartById,
  createCart,
  deleteCart,
} = require("../services/cart.service.js");
const { getProductById } = require("../services/product.service.js");
const { statusResponse } = require("../utils/response.js");
const {
  cartSuccessCodes,
  cartErrorCodes,
} = require("../constants/cart.constants.js");
const { productErrorCodes } = require("../constants/product.constants.js");
const isValidObjectId = require("../utils/isValidObjectId.js");


class CartController {
  constructor() {
    this.cart = [];
    this.product = [];
  }
  async getCarts(res, limit) {
    try {
      this.cart = await getAllCarts();

      let limitProducts = [...this.cart];

      if (!isNaN(parseInt(limit)) && limitParam > 0) {
        limitProducts = this.cart.slice(0, limitParam);
      }

      return statusResponse(res, limitProducts, cartSuccessCodes.SUCCESS_GET);
    } catch (error) {
      return statusResponse(res, null, error.message, 500, false);
    }
  }

  async getCartById(res, id) {
    try {
      this.cart = await getCartById(id);

      return statusResponse(res, this.cart);
    } catch (error) {
      if (error.message === cartErrorCodes.INVALID_FORMAT) {
        return statusResponse(res, null, error.message, 400, false);
      }

      if (error.message === cartErrorCodes.NOT_FOUND) {
        return statusResponse(res, null, error.message, 404, false);
      }

      return statusResponse(res, null, error.message, 500, false);
    }
  }

  async createCart(res) {
    try {
      this.cart = await createCart();

      return statusResponse(res, this.cart, cartSuccessCodes.SUCCESS_CREATE);
    } catch (error) {
      return statusResponse(res, null, error.message, 500, false);
    }
  }

  async deleteCart(res, id) {
    try {
      this.cart = await deleteCart(id);

      return statusResponse(res, this.cart, cartSuccessCodes.SUCCESS_DELETE);
    } catch (error) {
      if (error.message === cartErrorCodes.INVALID_FORMAT) {
        return statusResponse(res, null, error.message, 400, false);
      }

      if (error.message === cartErrorCodes.NOT_FOUND) {
        return statusResponse(res, null, error.message, 404, false);
      }

      return statusResponse(res, null, error.message, 500, false);
    }    
  }

  async addCartProduct(res, cid, pid, quantity, isReduceQuantity = false) {
    try {
      if (!isValidObjectId(pid)) {
        return statusResponse(res, null, productErrorCodes.INVALID_FORMAT, 400, false);
      }

      const cart = await getCartById(cid);
      const product = await getProductById(pid);

      if(product.stock < quantity) {
        return statusResponse(res, null, productErrorCodes.NOT_STOCK, 400, false);
      }
      
      const productIndex = cart.products.findIndex((prod) => prod.id.toString() === pid);

      if(productIndex !== -1) { 
        if(isReduceQuantity) {
          if(cart.products[productIndex].quantity <= quantity) {
            return statusResponse(res, null, cartErrorCodes.NOT_ENOUGH_STOCK, 400, false);
          }
          cart.products[productIndex].quantity -= quantity;
        } else {
          cart.products[productIndex].quantity += quantity;
        }

      } 

      if(productIndex === -1 && !isReduceQuantity) {
        cart.products.push({ id: pid, quantity });
      }
      
      await cart.save();

      const productResponse = {
        ...product._doc,
        quantity: cart.products[productIndex].quantity,
      }

      return statusResponse(
        res,
        productResponse,
        cartSuccessCodes.SUCCESS_ADD_PRODUCT
      );
    } catch (error) {
      if (error.message === cartErrorCodes.INVALID_FORMAT) {
        return statusResponse(res, null, error.message, 400, false);
      }

      if (error.message === cartErrorCodes.NOT_FOUND) {
        return statusResponse(res, null, error.message, 404, false);
      }

      if(error.message === productErrorCodes.INVALID_FORMAT) {
        return statusResponse(res, null, error.message, 400, false);
      }

      if(error.message === productErrorCodes.NOT_FOUND) {
        return statusResponse(res, null, error.message, 404, false);
      }

      return statusResponse(res, null, error.message, 500, false);
    }
  }

  async deleteCartProduct(res, cid, pid) {
    try {
      if (!isValidObjectId(pid)) {
        return statusResponse(res, null, productErrorCodes.INVALID_FORMAT, 400, false);
      }

      const cart = await getCartById(cid);
      const productIndex = cart.products.findIndex((prod) => prod.id.toString() === pid);

      if(productIndex === -1) {
        return statusResponse(res, null, cartErrorCodes.NOT_FOUND_PRODUCT, 404, false);
      }

      cart.products.splice(productIndex, 1);

      await cart.save();

      return statusResponse(res, cart, cartSuccessCodes.SUCCESS_DELETE_PRODUCT);
    } catch (error) {
      if (error.message === cartErrorCodes.INVALID_FORMAT) {
        return statusResponse(res, null, error.message, 400, false);
      }

      if (error.message === cartErrorCodes.NOT_FOUND) {
        return statusResponse(res, null, error.message, 404, false);
      }

      if(error.message === productErrorCodes.INVALID_FORMAT) {
        return statusResponse(res, null, error.message, 400, false);
      }

      if(error.message === productErrorCodes.NOT_FOUND) {
        return statusResponse(res, null, error.message, 404, false);
      }

      return statusResponse(res, null, error.message, 500, false);
    }
  }
}

module.exports = CartController;
