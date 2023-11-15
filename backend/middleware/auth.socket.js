const jwt = require('jsonwebtoken');

const socketMiddleware = (socket, next) => {
    const token = socket.handshake.query.token;
    if (!token) {
        return next(new Error('Authentication failed. No token provided.'));
    }
    jwt.verify(token, process.env.JWT_TOKEN, (err, decoded) => {
        if (err) {
            socket.emit('authenticationFailed', { message: 'Invalid token' });
            return next(new Error('Authentication failed. Invalid token.'));
        }
        socket.user = decoded.name;
        next();
    });
};

module.exports = { socketMiddleware };

