var request = require('request');

var options = {
    uri: "http://localhost:3001/get/pdf",
    method: 'POST',
    json: { content: 'cdcdscs', userID: "diuhiu2hedu28d2", fileName: "document" }
};

request(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        console.log(body.id)
    }
});