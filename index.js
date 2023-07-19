const express = require('express');
const http = require('http');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static('public'))

app.get('', (req, res)=> {
    res.sendFile('index.html');
});

const welcomeText = 'welcome!';

io.on('connection', (socket) => {
   socket.emit('message', welcomeText);

   socket.on('message', (message) => {
       io.emit('sendMessage', message);
   });
});

server.listen(process.env.PORT | 3000, () => {
   console.warn('app is running');
});
