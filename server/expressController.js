const express = require('express');
const app = express();
const pdfApi = require('./pdfGeneration/pdfGeneration');
const userApi = require('./serverAccount/userOp.js');
var bodyParser = require('body-parser');
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded()); // to support URL-encoded bodies
pdfApi.setUpApi(app);
app.listen(3001, function () {
    console.log('Example app listening on port 3001!')
})