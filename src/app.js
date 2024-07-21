const http = require("http");
const express = require("express");
const { create } = require("express-handlebars");
const path = require("path");
const { webSocketServer } = require("./websockets/server.js");

const app = express();
const PORT = 8080;
const server = http.createServer(app);

const hbs = create({
  extname: "hbs",
  partialsDir: path.join(__dirname, "views", "partials"),
});

webSocketServer(server);

const productsRouter = require("./routes/product.router.js");
const cartsRouter = require("./routes/cart.router.js");
const imagesRouter = require("./routes/image.router.js");
const staticRouter = require("./routes/static.router.js");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use("/api/product", productsRouter);
app.use("/api/cart", cartsRouter);
app.use("/api/upload", imagesRouter);
app.use("/views", staticRouter);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}!`);
});
