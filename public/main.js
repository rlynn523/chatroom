$(document).ready(function() {
    /* here you create a Manager object by calling the io function. this object
    will automatically attempt to connect to the server, and will allow you
    to send and recieve messages */
    var socket = io();
    // use jQuery to select input tag and messages div
    var input = $('#message');
    var messages = $('#messages');
    var username = $('#username');
    // function which appends a new <div> to the messages
    var addMessage = function(message, username) {
        messages.append('<div>' + message + '</div>');
    };
    var userType = function(message) {
        $('#userTyping').html(message);
    };
    /* add keydown listener to the imput, which calls the addMessage function
    with the contents of the input when the enter button is pressed, then clears
    the input */
    input.on('keydown', function(event) {
        var message = input.val();
        if(message) {
            socket.emit('typing', true);
        } else {
            socket.emit('typing', false);
        }
        if (event.keyCode != 13) {
            return;
        }
        addMessage(message, username);
        /* this sends a message to the Socket.IO server. the first argument
        is a name for our message, the second argument is some data to attach
        to our message */
        socket.emit('message', message, username);
        socket.emit('typing', false);
        input.val('');
    });
    username.on('keydown', function(event) {
        if (event.keyCode != 13) {
            return;
        }
        socket.emit('logIn', username.val());
        username.val('');
    });
    /* when the server sends you a message with the name message, you add the
    attached data to the messages div using the addMessage function */
    socket.on('message', addMessage);
    socket.on('typing', userType);
});
