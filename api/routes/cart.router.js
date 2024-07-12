const express = require("express");
const router = express.Router();

const ProductManager = require("../services/ProductManager.js");
const CartManager = require("../services/CartManager.js");

const Cart = new CartManager();
const Product = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const carts = await Cart.getCarts(req.query.limit);

    if (carts.data.length === 0) {
      return res.json({ status: res.statusCode, ...carts });
    }
    res.json({ status: res.statusCode, ...carts });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const cart = await Cart.getCartById(Number(req.params.id));

    if (!cart.data) {
      return res.json({ status: res.statusCode, ...cart });
    }
    res.json({ status: res.statusCode, ...cart });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/", async (req, res) => {
  try {
    const result = await Cart.generateCart();

    res.status(201).send({ status: res.statusCode, ...result });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  try{
    const productProcess = await Product.checkAvailableProductStock(Number(req.params.pid), req.body.quantity);

    if(!productProcess.available) {
      return res.status(400).send({ status: res.statusCode, ...productProcess });
    }

    const cartProcess = await Cart.addCartProduct(Number(req.params.cid), Number(req.params.pid), req.body.quantity);

    if (!cartProcess.data) {
      return res.status(400).send({ status: res.statusCode, ...cartProcess });
    }

    res.status(201).send({ status: res.statusCode, ...cartProcess });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/:cid/product/:pid", async (req, res) => {
  try {
    const result = await Cart.deleteCartProduct(Number(req.params.cid), Number(req.params.pid));

    if (!result.data) {
      return res.status(400).send({ status: res.statusCode, ...result });
    }

    res.status(200).send({ status: res.statusCode, ...result });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const result = await Cart.deleteCart(Number(req.params.id));

    if (!result.data) {
      return res.status(400).send({ status: res.statusCode, ...result });
    }

    res.status(200).send({ status: res.statusCode, ...result });
  } catch (error) {
    res.status(500).send(error);
  }
});

router.put("/:cid/product/:pid", async (req, res) => {
  try {
    const cartProcess = await Cart.reduceCartProductQuantity(Number(req.params.cid), Number(req.params.pid), req.body.quantity);

    if (!cartProcess.data) {
      return res.status(400).send({ status: res.statusCode, ...cartProcess });
    }

    res.status(200).send({ status: res.statusCode, ...cartProcess });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;