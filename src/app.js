const express = require("express");
const path = require("path");

const db = require("./config/db.js");

const productsRouter = require("./routes/product.router.js");
const cartsRouter = require("./routes/cart.router.js");
const imagesRouter = require("./routes/image.router.js");

const app = express();

db.dbConnect();
db.dbError;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/product", productsRouter);
app.use("/api/cart", cartsRouter);
app.use("/api/upload", imagesRouter);

app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

module.exports = app;