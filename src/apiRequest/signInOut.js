let request = require('request');
let signin = function (userToken) {
    let options = {
        uri: "http://localhost:3001/put/signin",
        method: 'POST',
        json: {userToken: userToken}
    };

    request(options, function (error, response, body) {
        console.log(response && response.body);
    });
}

exports.signin = signin;