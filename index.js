const { createServer } = require("http");
const app = require("./app");
const { Server } = require("socket.io");
require("dotenv").config();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:3000",  // 클라이언트 주소
    methods: ["GET", "POST"],
    credentials: true,
  },
});

require("./utils/io")(io);

httpServer.listen(5001, () => {
  console.log("Server listening on port 5001");
});
