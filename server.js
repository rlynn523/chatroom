var socket_io = require('socket.io');
var http = require('http');
var express = require('express');
var moment = require('moment');

var app = express();
app.use(express.static('public'));
/* wrap Express app in Node http.Server object. this allows Socket.IO to run
alongside Express */
var server = http.Server(app);
/* initialize an io object by passing the server into the socket_io function.
this creates a Socket.IO Server, wich is an EventEmitter */
var io = socket_io(server);
var clients = {};

/* add a listener to the connection event of the server. this will be called
whevenver a new client connects to the Socket.IO server */
io.on('connection', function(socket) {
    socket.on('logIn', function(username) {
        clients[socket.client.id] = username;
    });
    var id = socket.client.id;
    var time = moment().format('LTS');
    socket.on('typing', function(message) {
        var id = socket.client.id;
        if(message) {
            socket.broadcast.emit('typing', clients[id] + ' is typing...');
        } else {
            socket.broadcast.emit('typing', '');
        }
    });
    socket.broadcast.emit('message', id + ' connected at ' + time);
    /* add a listener to the socket which is used to communicate with the
    client. when a message with the name message is recieved on the socket, you
    simply print out the message */
    socket.on('message', function(message) {
        console.log('Received message:', message);
        /* socket.broadcast.emit method is used to send a message to all clients
        except one. it won't send the mesage to the client
        whose socket object you are using. it is used to broadcast the message
        that you recievd from a client to all the other clients */
        socket.broadcast.emit('message', message);
    });
    socket.on('disconnect', function() {
        var id = socket.client.id;
        var time = moment().format('LTS');
        socket.broadcast.emit('message', clients[id] + ' disconnected at ' + time);
    });
});

// you now call server.listen rather than app.listen
server.listen(8080);
