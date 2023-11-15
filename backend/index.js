const express = require('express');
const cookieParser = require('cookie-parser');
const http = require('http');
const fs = require('fs')
const cors = require('cors')
require("dotenv").config();
const socketIo = require('socket.io');
const { connection } = require('./db');
const { userRouter } = require('./routes/user.routes');
const { socketMiddleware } = require('./middleware/auth.socket');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});

app.use(express.json());
app.use(cors({
    origin: "*"
}));
app.use(cookieParser());

const connectedUsers = {};

io.use(socketMiddleware);

io.on('connection', (socket) => {
    console.log(`User connected : ${socket.user}`);

    connectedUsers[socket.id] = { name: socket.user, id: socket.id };

    io.emit("userList", Object.values(connectedUsers))

    socket.on('disconnect', () => {
        console.log(`User disconnected with ID: ${socket.id}`);
        delete connectedUsers[socket.id];
        io.emit("userList", Object.values(connectedUsers));
    });

    socket.on('message', ({ sender, recipient, message }) => {
        io.to(recipient).emit('message', { sender, message });
    });

    socket.on('image', ({ recipient, imageData }) => {
        // const base64Data = imageData.replace(/^data:image\/png;base64,/, '');
        // fs.writeFileSync('uploaded_image.png', base64Data, 'base64');
        io.to(recipient).emit('image', { imageData });
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
