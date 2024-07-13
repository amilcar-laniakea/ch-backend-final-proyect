const express = require("express");
const router = express.Router();

const ProductActions = require("../controllers/product.controller.js");

const Product = new ProductActions();

router.get("/", async (req, res) => Product.getProducts(res, req.query.limit));
router.get("/:id", (req, res) => Product.getProductById(res, String(req.params.id)));
router.post("/", (req, res) => Product.createProduct(res, req.body));
router.put("/:id", async (req, res) => Product.updateProduct(res, req.params.id, req.body));
router.delete("/:id", async (req, res) => Product.deleteProduct(res, req.params.id));

module.exports = router;