// Code adapted from: https://www.cometchat.com/tutorials/how-to-build-a-chat-app-with-websockets-and-node-js
// Author: Dylan Higgins
// Created: 04/21/2022
// index.js

const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./helper/formatDate')
const {
  getActiveUser,
  exitRoom,
  newUser,
  getIndividualRoomUsers,
} = require('./helper/userHelper');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set public folder
app.use(express.static(path.join(__dirname, 'public')));


// this block will run when the client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = newUser(socket.id, username, room);

    socket.join(user.room);

    // General welcome
    socket.emit('server-message', formatMessage("Titan", 'Greetings! '));
    socket.emit('server-message', formatMessage("Titan", 'Please obey the chat room rules.'));

    // Broadcast everytime users connects
    socket.broadcast
      .to(user.room)
      .emit(
        'server-message',
        formatMessage("Titan", `${user.username} has landed.`)
      );

    // Current active users and room name
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getIndividualRoomUsers(user.room)
    });
    
    
    
  });

  // Response when user is typing
  socket.on('typing', username=>{
    const user = getActiveUser(socket.id);
    io.to(user.room).emit('typing', username)
  });

  // Listen for client message
  socket.on('chatMessage', msg => {
    const user = getActiveUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = exitRoom(socket.id);

    if (user) {
      io.to(user.room).emit(
        'server-message',
        formatMessage("Titan", `${user.username} has left orbit.`)
      );

      // Current active users and room name
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getIndividualRoomUsers(user.room)
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));