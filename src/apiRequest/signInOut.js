let request = require('request');
const config = require('./../config.json');
const serverIP = config.serverIP;
let signin = function (userToken) {
    let options = {
        url: serverIP + ":3001/put/signin",
        method: 'POST',
        json: {userToken: userToken}
    };

    request(options, function (error, response, body) {
        console.log(response && response.body);
    });
}

exports.signin = signin;