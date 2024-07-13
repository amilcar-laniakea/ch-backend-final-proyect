const fs = require("fs");

const { validateProductData, validateTypeProductData } = require("../utils/validateProductData.js");
const generateId = require("../utils/generateId.js");
const generateDataFile = require("../utils/generateDataFile.js");

const { getAllProducts, getProductById, productCodeErrors } = require("../services/product.service.js");

const { statusResponse } = require("../utils/response.js");

class ProductController {
  constructor() {
    this.products = [];
    this.path = "./src/data/";
    this.fileName = "products.json";
  }

  async #manageFile() {
    return await generateDataFile(this.path, this.fileName);
  }

  async addProduct({
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnail = "",
  }) {
    this.products = await this.#manageFile();

    let error = "";

    error = validateProductData("title", "string", title);
    error = error + validateProductData("description", "string", description);
    error = error + validateProductData("category", "string", category);
    error = error + validateProductData("code", "number", code);
    error = error + validateProductData("price", "number", price);
    error = error + validateProductData("stock", "number", stock);

    if (error && error !== "") return { data: null, message: error };

    const id = generateId(this.products);

    const product = {
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnail,
      id,
    };

    this.products.push(product);
    await fs.promises.writeFile(
      this.path + this.fileName,
      JSON.stringify(this.products)
    );
    return {
      data: product,
      message: `Product with ID ${id}: added successfully`,
    };
  }

  async deleteProduct(id) {
    if (isNaN(id)) {
      return {
        data: null,
        message: "product id is required and must be a number",
      };
    }

    this.products = await this.#manageFile();
    const index = this.products.findIndex((p) => p.id === id);
    if (index === -1) return { data: null, message: "Product not found" };

    const productDeleted = this.products.splice(index, 1);
    await fs.promises.writeFile(
      this.path + this.fileName,
      JSON.stringify(this.products)
    );
    return {
      data: productDeleted,
      message: `Product with ID ${id}: was deleted successfully`,
    };
  }

  async updateProduct(
    id,
    { title, description, category, price, thumbnail, code, stock }
  ) {
    if (isNaN(id)) {
      return { data: null, message: "product id must be a number" };
    }

    this.products = await this.#manageFile();

    const productIndex = this.products.findIndex((prod) => prod.id === id);

    if (productIndex === -1) {
      return {
        data: null,
        message: `Product with requested ID ${id}: not found`,
      };
    }

    const product = this.products[productIndex];

    let error = "";

    error = validateTypeProductData("title", "string", title);
    error =
      error + validateTypeProductData("description", "string", description);
    error = error + validateTypeProductData("category", "string", category);
    error = error + validateTypeProductData("code", "number", code);
    error = error + validateTypeProductData("price", "number", price);
    error = error + validateTypeProductData("stock", "number", stock);
    error = error + validateTypeProductData("thumbnail", "string", thumbnail);

    if (error && error !== "") return { data: null, message: error };

    if (title !== undefined) product.title = title;
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (thumbnail !== undefined) product.thumbnail = thumbnail;
    if (code !== undefined) product.code = code;
    if (stock !== undefined) product.stock = stock;

    await fs.promises.writeFile(
      this.path + this.fileName,
      JSON.stringify(this.products)
    );

    return {
      data: this.products[productIndex],
      message: `Product with requested ID ${id}: updated successfully.`,
    };
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
    } catch(error) {
      if(error.message === productCodeErrors.NOT_FOUND) {
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
      if (error.message === productCodeErrors.INVALID_FORMAT) {
        return statusResponse(res, null, error.message, 400, false);
      }

      if (error.message === productCodeErrors.NOT_FOUND) {
        return statusResponse(res, null, error.message, 404, false);
      }

      return statusResponse(res, null, error.message, 500, false);
    }
  }

  async checkAvailableProductStock(id, quantity) {
    if (isNaN(id))
      return { status: false, message: "product id must be a number" };
    if (isNaN(quantity))
      return { status: false, message: "quantity must be a number" };
    this.products = await this.#manageFile();
    const product = this.products.find((p) => p.id === id);
    if (!product)
      return {
        status: false,
        message: `Product with requested ID ${id}: not found`,
      };
    if (product.stock < quantity)
      return {
        status: false,
        message: `Product with requested ID ${id}: out of stock`,
      };
    return { available: true, message: null };
  }
}

module.exports = ProductController;