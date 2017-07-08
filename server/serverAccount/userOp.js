googleTokenValidation = require('./googleTokenValidation');
const express = require('express');

setUpApi = function(){
    app.post('/put/signin', function (req, res) {
        let userToken = req.body.userToken;
        let userInfo = googleTokenValidation.getUserInfo(userToken);
        console.log(userInfo);
    })

}

