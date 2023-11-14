const express = require('express');
const cookieParser = require('cookie-parser');
const http = require('http');
const cors = require('cors')
require("dotenv").config();
const socketIo = require('socket.io');
const { connection } = require('./db');
const { userRouter } = require('./routes/user.routes');
// const { chatController } = require('./controllers/chat.controller');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});

app.use(express.json());
// app.use(cors());
app.use(cookieParser());

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

app.use("/user", userRouter);


server.listen(3000, async () => {
    try {
        await connection;
        console.log("connected to db")
        console.log("server is running at 3000")
    } catch (error) {
        return console.log(error)
    }
});
