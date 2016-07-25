var socket_io = require('socket.io');
var http = require('http');
var express = require('express');

var app = express();
app.use(express.static('public'));
/* wrap Express app in Node http.Server object. this allows Socket.IO to run
alongside Express */
var server = http.Server(app);
/* initialize an io object by passing the server into the socket_io function.
this creates a Socket.IO Server, wich is an EventEmitter */
var io = socket_io(server);
var clientNumber = 1;

/* add a listener to the connection event of the server. this will be called
whevenver a new client connects to the Socket.IO server */
io.on('connection', function(socket) {
    console.log('Client connected');
    console.log('Client total ' + (clientNumber++));
    socket.on('disconnect', function() {
        io.emit('message', 'Client disconnected');
    });
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
});

// you now call server.listen rather than app.listen
server.listen(8080);
