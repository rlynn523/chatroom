
$(document).ready(function() {
    var username = prompt("Please enter a username");
    console.log(username);
    /* here you create a Manager object by calling the io function. this object
    will automatically attempt to connect to the server, and will allow you
    to send and recieve messages */
    var socket = io();
    // use jQuery to select input tag and messages div
    var input = $('input');
    var messages = $('#messages');

    // function which appends a new <div> to the messages
    var addMessage = function(message) {
        messages.append('<div>' + message + '</div>');
    };
    
    /* add keydown listener to the imput, which calls the addMessage function
    with the contents of the input when the enter button is pressed, then clears
    the input */
    input.on('keydown', function(event) {
        if (event.keyCode != 13) {
            return;
        }
        var message = input.val();
        addMessage(message);
        /* this sends a message to the Socket.IO server. the first argument
        is a name for our message, the second argument is some data to attach
        to our message */
        socket.emit('message', message);
        input.val('');
    });
    /* when the server sends you a message with the name message, you add the
    attached data to the messages div using the addMessage function */
    socket.on('message', addMessage);
});
