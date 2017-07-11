const express = require('express');
const app = express();
const pdfApi = require('./pdfGeneration/pdfGeneration');
const userApi = require('./serverAccount/userOp.js');
const bodyParser = require('body-parser');
var cors = require('cors')
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
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });
app.use(allowCrossDomain);
//app.use(cors());
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded()); // to support URL-encoded bodies
pdfApi.setUpApi(app);
userApi.setUpApi(app);
app.listen(3001, function () {
    console.log('Example app listening on port 3001!')
})