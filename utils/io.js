const chatController = require("../Controllers/chat.controller");
const userController = require("../Controllers/user.controller");

module.exports = function(io) {
  // 클라이언트가 연결되었을 때
  io.on("connection", (socket) => {
    console.log("Client is connected", socket.id);

    // 클라이언트가 'login' 이벤트를 전송했을 때
    socket.on("login", async (userName, cb) => {
      console.log("Backend received login:", userName);
      try {
        const user = await userController.saveUser(userName, socket.id);
        const welcomeMessage = {
          chat: `${user.name} 이 채팅방에 참가하였습니다.`,
          user: { id: null, name: "system" },
        };
        // 모든 클라이언트에 메시지를 전송
        io.emit("message", welcomeMessage);
        // 클라이언트에 응답
        cb({ ok: true, data: user });
      } catch (error) {
        cb({ ok: false, error: error.message });
      }
    });

    // 클라이언트가 'sendMessage' 이벤트를 전송했을 때
    socket.on("sendMessage", async (message, cb) => {
      try {
        const user = await userController.checkUser(socket.id);
        const newMessage = await chatController.saveChat(message, user);
        // 모든 클라이언트에 메시지를 전송
        io.emit("message", newMessage);
        cb({ ok: true });
      } catch (error) {
        cb({ ok: false, error: error.message });
      }
    });

    // 클라이언트가 연결을 끊었을 때
    socket.on("disconnect", () => {
      console.log("User disconnected", socket.id);
    });
  });
};
