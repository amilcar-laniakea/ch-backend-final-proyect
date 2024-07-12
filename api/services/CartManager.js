const fs = require("fs");

const generateDataFile = require("../utils/generateDataFile.js");
const generateId = require("../utils/generateId.js");

const { validateProductData } = require("../utils/validateProductData.js");

class CartManager {
  constructor() {
    this.cart = [];
    this.path = "./api/data/";
    this.fileName = "carts.json";
  }

  async #manageFile() {
    return await generateDataFile(this.path, this.fileName);
  }

  async generateCart() {
    this.cart = await this.#manageFile();

    const cart = {
      id: generateId(this.cart),
      products: [],
    };
    this.cart.push(cart);

    await fs.promises.writeFile(this.path + this.fileName, JSON.stringify(this.cart));

    return {data: cart, message: `Cart with ID ${cart.id}: added successfully`}
  }

  async getCarts(limit) {
    let limitParam = parseInt(limit);

    this.cart = await this.#manageFile();

    let limitProducts = [...this.cart];

    if (!isNaN(limitParam) && limitParam > 0) {
      limitProducts = this.cart.slice(0, limitParam);
    }

    return {
      data: limitProducts,
      message: limitProducts.length === 0 ? "No carts available" : null,
    };
  }

  async getCartById(id) {
    this.cart = await this.#manageFile();
    const product = this.cart.find((p) => p.id === id);

    if (isNaN(id)) {
      return { data: null, message: "cart id must be a number" };
    }

    if (!product) {
      return { data: null, message: `Cart with requested ID ${id}: not found` };
    }

    return { data: product, message: null };
  }

  async addCartProduct(cid, pid, quantity) {
    if (isNaN(cid)) {
      return { data: null, message: "cart id must be a number" };
    }

    this.cart = await this.#manageFile();

    const cartIndex = this.cart.findIndex((cart) => cart.id === cid);

    if (cartIndex === -1) {
      return { data: null, message: `cart with requested ID ${cid}: not found` };
    }

    const productIndex = this.cart[cartIndex].products.findIndex((prod) => prod.id === pid);

    if (productIndex !== -1) {
      this.cart[cartIndex].products[productIndex].quantity += quantity;
    } else {  
      this.cart[cartIndex].products.push({ id: pid, quantity });
    }

    await fs.promises.writeFile(this.path + this.fileName, JSON.stringify(this.cart));   

    return {  data: this.cart[cartIndex].products[productIndex], message: `Product with ID ${pid}: was added to cart with ID ${cid} successfully` };
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
      return { data: null, message: `cart with requested ID ${cid}: not found` };
    }

    const productIndex = this.cart[cartIndex].products.findIndex((prod) => prod.id === pid);

    if (productIndex === -1) {
      return { data: null, message: `product with requested ID ${pid}: not found` };
    }

    this.cart[cartIndex].products.splice(productIndex, 1);

    await fs.promises.writeFile(this.path + this.fileName, JSON.stringify(this.cart));

    return { data: this.cart[cartIndex], message: `Product with requested ID ${pid}: was deleted from cart with ID ${cid} successfully` };
  }

  async deleteCart(id) {
    if (isNaN(id)) {
      return { data: null, message: "cart must be a number" };
    }

    this.cart = await this.#manageFile();
    const index = this.cart.findIndex((p) => p.id === id);
    if (index === -1) return {data: null, message: 'Cart not found'}

    const cartDeleted = this.cart.splice(index, 1);
    await fs.promises.writeFile(this.path + this.fileName, JSON.stringify(this.cart));
    return { data: cartDeleted, message: `Cart with ID ${id}: was deleted successfully` };
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
      return { data: null, message: `cart with requested ID ${cid}: not found` };
    }

    const productIndex = this.cart[cartIndex].products.findIndex((prod) => prod.id === pid);

    if (productIndex === -1) {
      return { data: null, message: `product with requested ID ${pid}: not found` };
    }

    if (this.cart[cartIndex].products[productIndex].quantity < quantity) {
      return { data: null, message: `Product with requested ID ${pid}: quantity can't be less than ${quantity}` };
    }

    this.cart[cartIndex].products[productIndex].quantity -= quantity;

    await fs.promises.writeFile(this.path + this.fileName, JSON.stringify(this.cart));

    return { data: this.cart[cartIndex].products[productIndex], message: `Product with requested ID ${pid}: quantity was reduced by ${quantity} successfully` };
  }
}

module.exports = CartManager;
