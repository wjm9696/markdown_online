const socketio = require('socket.io');
const process = require('process');
const socketioRedis = require('socket.io-redis');
const RedisServer = require('redis-server');
// const redisServer = new RedisServer({
//   port: 6379,
//   bin: './redis-3.2.9/src/redis-server'
// });

const setUpApi = function (app, server) {
  //redisServer.open((err) => {
    // if (err === null) {
    //   console.log(err);
    // }
    var io = socketio(server);
    io.adapter(socketioRedis({ host: '127.0.0.1', port: 16379 }));
    io.on('connection', (socket) => {
      console.log("conneted");
      socket.on('joinFile', (fileID) => {
        socket.join(fileID);
      });
      socket.on('updateContent', (info) => {
        const fileID = info.fileID;
        const content = info.content;
        console.log('updateContent', fileID, content);

        io.to(fileID).emit('contentIn', content);
      });
    //});
  });

}

exports.setUpApi = setUpApi;