const { Server } = require("socket.io");

let io;

const webSocketServer = (server) => {
  io = new Server(server);

  io.on("connection", (socket) => {
    console.log("client has been connected!");

    socket.on("disconnect", () => {
      console.log("client has been disconnected!");
    });
  });
};

module.exports = { webSocketServer, getIo: () => io };
