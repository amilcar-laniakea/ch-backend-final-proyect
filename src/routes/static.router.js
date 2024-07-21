const express = require("express");
const router = express.Router();

const ProductManager = require("../services/ProductManager.js");

const Product = new ProductManager();

router.get("/home", async (req, res) => {
  let response = { error: false, products: [] };

   try {
    const products = await Product.getProducts(req?.query?.limit);

    response = { ...response, products: products.data };
  } catch (error) {
    response = { ...response, error: true };
  }

  res.render("home", { response });
});

router.get("/real-time-products", async (req, res) => {
  let response = { error: false, products: [] };

  try {
    const products = await Product.getProducts(req?.query?.limit);

    response = { ...response, products: products.data.reverse() };
  } catch (error) {
    response = { ...response, error: true };
  }

  res.render("realTimeProducts", { response });
});


module.exports = router;