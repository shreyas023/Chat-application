// running on http://localhost:8000

const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const path = require('path');

app.use(express.static(path.join(__dirname, '../')));

server.listen(8000, () => {
    console.log('Server is running on port 8000');
});

const users = {};

io.on('connection', socket =>{
    socket.on('new-user-joined', name =>{
        console.log('New user', name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message =>{
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    });

    socket.on('disconnect', message =>{
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
});
