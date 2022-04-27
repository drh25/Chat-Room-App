// Code adapted from: https://www.cometchat.com/tutorials/how-to-build-a-chat-app-with-websockets-and-node-js
// Author: Dylan Higgins
// Created: 04/21/2022
// public/js/main.js

const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const msg = document.getElementById('msg');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const feedback = document.getElementById('feedback')

const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

socket.on('message', (message) => {
  outputMessage(message, false);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});


socket.on('server-message', (message) => {
  outputMessage(message, true);

});
// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  // Get message text
  let msg = e.target.elements.msg.value;
  msg = msg.trim();

  if (!msg) {
    return false;
  }

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});


//User is Typing
msg.addEventListener('keypress', function(){
  socket.emit('typing', username);
});

// Output message to DOM
function outputMessage(message, server) {
  const div = document.createElement('div');
  
  if (server)
    div.classList.add('server');
  
  div.classList.add('message');
  const p = document.createElement('p');
  p.classList.add('meta');
  p.innerText = message.username;
  p.innerHTML += `<span>${message.time}</span>`;
  div.appendChild(p);
  const para = document.createElement('p');
  para.classList.add('text');
  para.innerText = message.text;
  div.appendChild(para);
  document.querySelector('.chat-messages').appendChild(div);
}

// Output someone is typing
socket.on('typing', (user)=>{
  if(user!==username){
    feedback.innerHTML = '<p><em>' + user + ' is typing... <em><p>';
    setTimeout(()=> feedback.innerHTML = '',1500);
  }
});

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = '';
  users.forEach((user) => {
    const li = document.createElement('li');
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
  const leaveRoom = confirm('Are you sure you want to leave?');

  if (leaveRoom) {
    window.location = '../index.html';
  }
});