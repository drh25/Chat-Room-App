// Code from: https://www.cometchat.com/tutorials/how-to-build-a-chat-app-with-websockets-and-node-js
// helper/userHelper.js

const users = [];
const typingUsers=[];
// Join user to chat
function newUser(id, username, room) {
  const user = { id, username, room };

  users.push(user);

  return user;
}
function userIsTyping(id,username, room){
  const user = { id, username, room };

  typingUsers.push(user);

  return user;
}

// Get current user
function getActiveUser(id) {
  return users.find(user => user.id === id);
}

// User leaves chat
function exitRoom(id) {
  const index = users.findIndex(user => user.id === id);

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
}
// Get room typing users
function getIndividualRoomTypingUsers(room) {
  return typingUsers.filter(user => user.room === room);
}
// Get room users
function getIndividualRoomUsers(room) {
  return users.filter(user => user.room === room);
}

module.exports = {
  newUser,
  getActiveUser,
  exitRoom,
  getIndividualRoomUsers,
  userIsTyping,
  getIndividualRoomTypingUsers


};