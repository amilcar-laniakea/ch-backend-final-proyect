
const { getIo } = require("../websockets/server.js");

const socketDataResponse = async (socketName, dataResponse, ProductEntity) => {
  const io = getIo();

  if (dataResponse && io) {
    io.emit(socketName, dataResponse);

    const products = await ProductEntity.getProducts();

    if (products && products.data.length > 0) {
      io.emit("listProductUpdated", products.data);
    }
  } else {
    console.error("error: response => io socket", dataResponse, io);
  }
};

module.exports = { socketDataResponse };
