var express = require('express');
var app = express();
var server = require('http').Server(app);

var io = require('socket.io')(server);

// Telling express to use /app contents as the static content
app.use(express.static(__dirname + '/app'));

// The server runs on a given 'PORT' or on port 8080
const port = process.env.PORT || 8080;

// The socket is turned on. Conenction is the default method for conenction
// StartDrawing is for line drawing and drawSquare is for drawing rectangles
io.sockets.on('connection', function (socket) {
    socket.on('startDrawing', (data) => socket.broadcast.emit('startDrawing', data));
    socket.on('drawSquare', (data) => socket.broadcast.emit('drawSquare', data));
    socket.on('clear', (data) => socket.broadcast.emit('clear'));
});



server.listen(port, () => console.log('server running at port ' + port));
