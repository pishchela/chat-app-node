const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const Filter = require('bad-words');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const { generateMessage, generateLocationMessage } = require('./src/utils/messages');

const {
    addUser,
    getUsersInRoom,
    getUser,
    removeUser,
    getRooms,
} = require('./src/utils/users');

app.use(express.static('public'));

app.get('', (req, res)=> {
    res.sendFile('index.html');
});

const messages = {
  welcome: 'welcome!',
  newUser: 'has joined!',
  disconnected: ' has left'
};

const ADMIN_NAME = 'Admin';

io.on('connection', (socket) => {

   socket.on('getRooms', (_, callback) => {
       callback(getRooms());
   });

   socket.on('join', (options, callback) => {
       console.warn(options);
       const { error, user } = addUser({ id: socket.id, ...options });
       if (error) {
           return callback(error);
       }
       socket.join(user.room);

       socket.emit('message', generateMessage(messages.welcome, ADMIN_NAME));
       socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} ${messages.welcome}`, user.username));
       io.to(user.room).emit('roomData', {
           users: getUsersInRoom(user.room),
           room: user.room,
       });
       io.emit('getRooms', getRooms());

       callback();
   });


   socket.on('sendMessage', (message, callback) => {
       const filter = new Filter();

       const user = getUser(socket.id);

       if (filter.isProfane(message)) {
           return callback('Profanity is not allowed!');
       }

       io.to(user.room).emit('message', generateMessage(message, user.username));
       callback();
   });

    socket.on('sendLocation', (location, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('locationMessage', generateLocationMessage(location, user.username));
        callback();
    });

   socket.on('disconnect', () => {
       const user = removeUser(socket.id);

       if (user) {
           io.to(user.room).emit('message', generateMessage(`${user.username}${messages.disconnected}`, ADMIN_NAME));
           io.to(user.room).emit('roomData', {
               users: getUsersInRoom(user.room),
               room: user.room,
           });
           io.emit('getRooms', getRooms());
       }
   });
});

server.listen(process.env.PORT | 3000, () => {
   console.warn('app is running');
});
