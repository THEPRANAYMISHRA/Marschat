const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://127.0.0.1:5500",
        methods: ["GET", "POST"]
    }
});

const connectedUsers = {};

io.on('connection', (socket) => {
    console.log(`User connected with ID: ${socket.id}`);

    connectedUsers[socket.id] = socket.id;

    io.emit("userList", Object.values(connectedUsers))

    socket.on('disconnect', () => {
        console.log(`User disconnected with ID: ${socket.id}`);
        delete connectedUsers[socket.id];
        io.emit("userList", Object.values(connectedUsers));
    });

    socket.on('message', ({ sender, recipient, message }) => {
        io.to(recipient).emit('message', { sender, message });
    });

});




server.listen(3000, () => {
    console.log('Socket server  is running on http://localhost:3000');
});
