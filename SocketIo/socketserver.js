const express = require("express");
const { Server } = require("socket.io");
const { createServer } = require("http");
const { ExpressPeerServer } = require("peer");

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://chatapp-omega-lemon.vercel.app", 
    methods: ["GET", "POST"],
    credentials: true,
  },
});


const peerServer = ExpressPeerServer(server, {
  debug: true
})

app.use("/peerjs", peerServer);

// console.log("Backend: Socket.io server is ready...");

const users = new Map();

io.on("connection", (socket) => {
  console.log(`User connected with socket ID: ${socket.id}`);

  socket.on("register", (userId) => {
    users.set(userId, socket.id);
    // console.log(`User ${userId} mapped to socket ID: ${socket.id}`);

    // Send updated online users to all clients
    io.emit("getOnline", Array.from(users.keys()));
  });

  socket.on("send-message", (data) => {
    const { receiverId, message, senderId } = data;
    const receiverSocketId = users.get(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive-message", { message, senderId });
      // console.log(`Sent message to ${receiverId} at socket ${receiverSocketId}`);
    } else {
      console.log(`User ${receiverId} is not connected.`);
    }
  });

  socket.on("user-call", ({ to, from, peerId }) => {
    console.log('user-call event received:', { to, from, peerId });

    // Look up the receiver's socket ID
    const receiverSocketId = users.get(to);
    console.log("Users map:", Array.from(users.entries())); 

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("incoming-call", { from, peerId });
      console.log("backend: call sent", { from, peerId, receiverSocketId });
    } else {
      console.log(`User ${to} is not online or registered.`);
    }
  });


  socket.on("disconnect", () => {
    let disconnectedUserId = null;

    users.forEach((socketId, userId) => {
      if (socketId === socket.id) {
        disconnectedUserId = userId;
        users.delete(userId);
      }
    });

    console.log(`User Disconnected: ${socket.id}`);

    // io.emit("getOnline", Array.from(users.keys()));
  });
});

module.exports = { io, app, server };
