const express = require("express");
const router = express.Router();

const ProductActions = require("../controllers/product.controller.js");
const CartActions = require("../controllers/cart.controller.js");

const Cart = new CartActions();
const Product = new ProductActions();

router.get("/", async (req, res) => Cart.getCarts(res, req.query.limit));
router.get("/:id", async (req, res) => Cart.getCartById(res, req.params.id));
router.post("/", (_, res) => Cart.createCart(res));

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

router.delete("/:id", (req, res) => Cart.deleteCart(res, req.params.id));

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