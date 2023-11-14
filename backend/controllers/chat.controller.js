// const connectedUsers = {};

// const chatController = (socket) => {
//     console.log(`User connected with ID: ${socket.id}`);

//     connectedUsers[socket.id] = socket.id;

//     io.emit("userList", Object.values(connectedUsers))

//     socket.on('disconnect', () => {
//         console.log(`User disconnected with ID: ${socket.id}`);
//         delete connectedUsers[socket.id];
//         io.emit("userList", Object.values(connectedUsers));
//     });

//     socket.on('message', ({ sender, recipient, message }) => {
//         io.to(recipient).emit('message', { sender, message });
//     });

// }

// module.exports = { chatController };