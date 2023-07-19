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

let count = 0;

io.on('connection', (socket) => {
    console.log('new web socket connection');

    socket.emit('countUpdated', count);

    socket.on('increment', () => {
        io.emit('countUpdated', ++count);
    });
});

server.listen(process.env.PORT | 3000, () => {
   console.warn('app is running');
});
