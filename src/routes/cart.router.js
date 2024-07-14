const express = require("express");
const CartActions = require("../controllers/cart.controller.js");

const router = express.Router();

const Cart = new CartActions();

router.get("/", async (req, res) => Cart.getCarts(res, req.query.limit));
router.get("/:id", async (req, res) => Cart.getCartById(res, req.params.id));
router.post("/", (_, res) => Cart.createCart(res));
router.post("/:cid/product/:pid", async (req, res) => Cart.addCartProduct(res, req.params.cid, req.params.pid, req.body.quantity, req.body.isReduceQuantity));
router.delete("/:cid/product/:pid", async (req, res) => Cart.deleteCartProduct(res, req.params.cid, req.params.pid));
router.delete("/:id", (req, res) => Cart.deleteCart(res, req.params.id));

module.exports = router;  