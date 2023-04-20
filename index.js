const express = require('express');
const app = express();
app.use(express.json());
const cors = require('cors');
const { errorHandler } = require('./middlewares/errorHandler');
const userRoutes = require('./routes/userRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const messageRoutes = require('./routes/messageRoutes');
const { connectDB } = require('./utils/connectDB');
const AppError = require('./utils/AppError');
const { authCheck } = require('./middlewares/authCheck');
require('dotenv').config();

const allowedOrigins = ['http://localhost:3000', process.env.CLIENT_URL];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests from allowed origins
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);

connectDB();

app.use('/api/users', userRoutes);

app.use(authCheck);
app.use('/api/conversations', conversationRoutes);
app.use('/api/messages', messageRoutes);

app.all('*', (req, res, next) => {
  next(new AppError(404, `Cannot find ${req.originalUrl} on this server`));
});

app.use(errorHandler);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server running on port ${process.env.PORT}`)
);

const io = require('socket.io')(server, { cors: process.env.CLIENT_URL });

let users = [];

const addUser = (userId, socketId) => {
  if (!users.some((user) => user.userId === userId)) {
    users.push({ userId, socketId });
  }
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on('connection', (socket) => {
  // connect
  socket.on('addUser', (userId) => {
    addUser(userId, socket.id);
    io.emit('getUsers', users);
  });

  // send and get message
  socket.on('sendMessage', ({ senderId, receiverId, text }) => {
    const user = getUser(receiverId);
    io.to(user.socketId).emit('getMessage', {
      senderId,
      text,
    });
  });

  // disconnect
  socket.on('disconnect', () => {
    console.log('a user disconnected');
    removeUser(socket.id);
    io.emit('getUsers', users);
  });
});
