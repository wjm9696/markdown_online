let request = require('request');
const config = require('./../config.json');
const serverIP = config.serverIP;
const serverPort = config.serverPort;

let signin = function (userToken) {
    let options = {
        url: `${serverIP}:${serverPort}/put/signin`,
        method: 'POST',
        json: {userToken: userToken}
    };

    request(options, function (error, response, body) {
        console.log(response && response.body);
    });
}

exports.signin = signin;