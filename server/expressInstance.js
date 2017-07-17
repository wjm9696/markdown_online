const express = require('express');
const app = express();
const pdfApi = require('./pdfGeneration/pdfGeneration');
const userApi = require('./serverAccount/userOp.js');
const socketApi = require('./socketIO/serverSocket.js');
const bodyParser = require('body-parser');
var cors = require('cors');
const port = process.env.PORT;
server = app.listen(port, function () {
    console.log('Example app listening on port '+port);
})
var allowCrossDomain = function(req, res, next) {
    
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      console.log("options")
      res.send(200);
      return next(new Error());
    }
    else {
      next();
    }
};
// app.use(function (req, res, next) {
//     console.log("signin"+req.body);
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     res.send(200);
//     return next(new Error());
// });
//app.use(allowCrossDomain);
//app.use(cors());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded()); // to support URL-encoded bodies
pdfApi.setUpApi(app);
userApi.setUpApi(app);
socketApi.setUpApi(app, server);
