let request = require('request');

let requestForPdf = function (content, userID, fileName) {
    let options = {
        uri: "http://localhost:3001/get/pdf",
        method: 'POST',
        json: { content: content, userID: "diuhiu2hedu28d2", fileName: "document" }
    };
    console.log(options);

    request(options, function (error, response, body) {
        console.log(response.body);
        let apiCall = response.body.apiCall;
        window.open("http://localhost:3001"+apiCall, '_blank')
    });
}

exports.requestForPdf = requestForPdf;

