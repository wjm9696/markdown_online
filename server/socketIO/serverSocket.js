const express = require('express'),
  socketio = require('socket.io'),
  process = require('process'),
  socketioRedis = require('socket.io-redis');

var app = express();
//var server = app.listen(process.argv[2]);
var server = app.listen(process.env.PORT, function () {
  console.log('socket io server listening on port' + process.env.PORT)
})
var io = socketio(server);
//var io = require('socket.io')(3003)

//app.use(express.static('static'));

io.adapter(socketioRedis({host: "localhost", port: 16379}));
io.on('connection', (socket) => {
  console.log("connect")
  io.emit('event',"shitEvent");
  socket.on('test_event', (message) => {
    console.log(message);
    
    // Object.keys(socket.rooms).filter((r) => r != socket.id)
    // .forEach((r) => socket.leave(r));

    // setTimeout(() => {
    //   socket.join(room);
    //   socket.emit('event', 'Joined room ' + room);
    //   socket.broadcast.to(room).emit('event', 'Someone joined room ' + room);
    // }, 0);
  })
});