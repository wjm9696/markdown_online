var socket = require('socket.io-client')('http://localhost:'+process.env.PORT);
var pdfApi = require('./src/apiRequest/requestPDF.js');
var clientSocket = require('./src/apiRequest/clientSocket.js');
//var socket = io({transports: ['websocket'], upgrade: false});
clientSocket.emitEvent(socket);
socket.on('event',function(message){
  console.log("get message")
})