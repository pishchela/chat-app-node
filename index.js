const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const { generateMessage, generateLocationMessage } = require('./src/utils/messages');

app.use(express.static('public'));

app.get('', (req, res)=> {
    res.sendFile('index.html');
});

const messages = {
  welcome: 'welcome!',
  newUser: 'A new user has joined!',
  disconnected: 'User has left'
};

io.on('connection', (socket) => {
   socket.emit('message', generateMessage(messages.welcome));
   socket.broadcast.emit('message', generateMessage(messages.newUser));

   socket.on('sendMessage', (message, callback) => {
       const filter = new Filter();

       if (filter.isProfane(message)) {
           return callback('Profanity is not allowed!');
       }

       io.emit('message', generateMessage(message));
       callback();
   });

    socket.on('sendLocation', (location, callback) => {
        io.emit('locationMessage', generateLocationMessage(location));
        callback();
    });

   socket.on('disconnect', () => {
      io.emit('message', generateMessage(messages.disconnected))
   });
});

server.listen(process.env.PORT | 3000, () => {
   console.warn('app is running');
});
