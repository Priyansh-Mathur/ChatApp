const Message = require("../models/Message");

const onlineUsers = new Map();

const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("addUser", (userId) => {
      onlineUsers.set(userId, socket.id);
      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
    });

    socket.on("sendMessage", async (data) => {
      try {
        const { sender, receiver, text } = data;

        const message = await Message.create({
          sender,
          receiver,
          text
        });

        const receiverSocketId = onlineUsers.get(receiver);

        if (receiverSocketId) {
          io.to(receiverSocketId).emit("receiveMessage", message);
        }

        socket.emit("messageSent", message);
      } catch (error) {
        socket.emit("messageError", error.message);
      }
    });

    socket.on("typing", ({ sender, receiver }) => {
      const receiverSocketId = onlineUsers.get(receiver);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("typing", { sender });
      }
    });

    socket.on("stopTyping", ({ sender, receiver }) => {
      const receiverSocketId = onlineUsers.get(receiver);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("stopTyping", { sender });
      }
    });

    socket.on("disconnect", () => {
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          break;
        }
      }

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      console.log("User disconnected:", socket.id);
    });
  });
};

module.exports = socketHandler;