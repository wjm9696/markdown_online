
let emitEvent = function(socket){
     socket.emit('test_event',"test");
 }

 exports.emitEvent = emitEvent;