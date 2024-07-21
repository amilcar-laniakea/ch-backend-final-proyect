const express = require("express");
const router = express.Router();
const { getIo } = require("../websockets/server.js");

const ProductManager = require("../services/ProductManager.js");

const Product = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const products = await Product.getProducts(req.query.limit);

    if (products.data.length === 0) {
      return res.json({ status: res.statusCode, ...products});
    }

    res.json({status: res.statusCode, ...products});
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.getProductById(Number(req.params.id));

    if (!product.data) {
      return res.json({ status: res.statusCode, ...product });  
    }

    res.json({ status: res.statusCode, ...product });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const result = await Product.addProduct(req.body);

    if(!result.data) {
      return res.status(400).send({ status: res.statusCode, ...result });
    }
    
    const io = getIo();

    io.emit("productAdded", result.data);

    res.status(201).send({ status: res.statusCode, ...result });
  } catch (error) {

    console.log('error', error);
    res.status(500).send(error);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const result = await Product.updateProduct(Number(req.params.id), req.body);

    if(!result.data) {
      return res.status(400).send({ status: res.statusCode, ...result });
    }

    const io = getIo();

    io.emit("productUpdated", result.data);

    res.status(200).send({ status: res.statusCode, ...result });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await Product.deleteProduct(Number(req.params.id));
    
    if(!result.data) {
      return res.status(400).send({ status: res.statusCode, ...result });
    }

    const io = getIo();

    io.emit("productDeleted", result.data[0]);
    
    res.status(200).send(result);
  } catch (error) {
    console.log('error', error);
    res.status(500).send(error);
  }
});

module.exports = router;