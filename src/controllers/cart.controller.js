const fs = require("fs");

const generateDataFile = require("../utils/generateDataFile.js");

const { cartSuccessCodes, cartErrorCodes } = require("../constants/cart.constants.js");
const {
  getAllCarts,
  getCartById,
  createCart,
  deleteCart,
} = require("../services/cart.service.js"); 
const { statusResponse } = require("../utils/response.js");


class CartController {
  constructor() {
    this.cart = [];
    this.path = "./src/data/";
    this.fileName = "carts.json";
  }

  async #manageFile() {
    return await generateDataFile(this.path, this.fileName);
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

  async addCartProduct(cid, pid, quantity) {
    if (isNaN(cid)) {
      return { data: null, message: "cart id must be a number" };
    }

    this.cart = await this.#manageFile();

    const cartIndex = this.cart.findIndex((cart) => cart.id === cid);

    if (cartIndex === -1) {
      return {
        data: null,
        message: `cart with requested ID ${cid}: not found`,
      };
    }

    const productIndex = this.cart[cartIndex].products.findIndex(
      (prod) => prod.id === pid
    );

    if (productIndex !== -1) {
      this.cart[cartIndex].products[productIndex].quantity += quantity;
    } else {
      this.cart[cartIndex].products.push({ id: pid, quantity });
    }

    await fs.promises.writeFile(
      this.path + this.fileName,
      JSON.stringify(this.cart)
    );

    return {
      data: this.cart[cartIndex].products[productIndex],
      message: `Product with ID ${pid}: was added to cart with ID ${cid} successfully`,
    };
  }

  async deleteCartProduct(cid, pid) {
    if (isNaN(cid)) {
      return { data: null, message: "cart id must be a number" };
    }
    if (isNaN(pid)) {
      return { data: null, message: "product id must be a number" };
    }

    this.cart = await this.#manageFile();

    const cartIndex = this.cart.findIndex((cart) => cart.id === cid);

    if (cartIndex === -1) {
      return {
        data: null,
        message: `cart with requested ID ${cid}: not found`,
      };
    }

    const productIndex = this.cart[cartIndex].products.findIndex(
      (prod) => prod.id === pid
    );

    if (productIndex === -1) {
      return {
        data: null,
        message: `product with requested ID ${pid}: not found`,
      };
    }

    this.cart[cartIndex].products.splice(productIndex, 1);

    await fs.promises.writeFile(
      this.path + this.fileName,
      JSON.stringify(this.cart)
    );

    return {
      data: this.cart[cartIndex],
      message: `Product with requested ID ${pid}: was deleted from cart with ID ${cid} successfully`,
    };
  }

  async reduceCartProductQuantity(cid, pid, quantity) {
    if (isNaN(cid)) {
      return { data: null, message: "cart id must be a number" };
    }
    if (isNaN(pid)) {
      return { data: null, message: "product id must be a number" };
    }
    if (isNaN(quantity)) {
      return { data: null, message: "quantity must be a number" };
    }

    this.cart = await this.#manageFile();

    const cartIndex = this.cart.findIndex((cart) => cart.id === cid);

    if (cartIndex === -1) {
      return {
        data: null,
        message: `cart with requested ID ${cid}: not found`,
      };
    }

    const productIndex = this.cart[cartIndex].products.findIndex(
      (prod) => prod.id === pid
    );

    if (productIndex === -1) {
      return {
        data: null,
        message: `product with requested ID ${pid}: not found`,
      };
    }

    if (this.cart[cartIndex].products[productIndex].quantity < quantity) {
      return {
        data: null,
        message: `Product with requested ID ${pid}: quantity can't be less than ${quantity}`,
      };
    }

    this.cart[cartIndex].products[productIndex].quantity -= quantity;

    await fs.promises.writeFile(
      this.path + this.fileName,
      JSON.stringify(this.cart)
    );

    return {
      data: this.cart[cartIndex].products[productIndex],
      message: `Product with requested ID ${pid}: quantity was reduced by ${quantity} successfully`,
    };
  }
}

module.exports = CartController;
