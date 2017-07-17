const express = require('express');
const app = express();
const bodyParser = require('body-parser');

server = app.listen(3001, function () {
    console.log('director listening on port 3001!');
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
app.use(allowCrossDomain);
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded()); // to support URL-encoded bodies


app.get('*',function(req,res){  
    console.log("localhost:3002/"+req.url);
    res.redirect("http://localhost:3002/"+req.url);  
})

app.post('*',function(req,res){  
    console.log("localhost:3002"+req.url);
    res.redirect("http://ocalhost:3002"+req.url);   
})
