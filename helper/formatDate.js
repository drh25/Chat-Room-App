// Code from: https://www.cometchat.com/tutorials/how-to-build-a-chat-app-with-websockets-and-node-js
// Created: 04/21/2022
// helper/formatDate.js

const moment = require('moment');

function formatMessage(username, text) {
  return {
    username,
    text,
    time: moment().format('h:mm a')
  };
}

module.exports = formatMessage;