let request = require('request');

let requestForPdf = function (content, userID, fileName) {
    let options = {
        url: "http://localhost:3001/get/pdf",
        method: 'POST',
        json: { content: content, userID: "diuhiu2hedu28d2", fileName: "document" }
    };
    console.log(options);

    request(options, (error, response, body) => {
        let apiCall = response.body.apiCall;
        window.open("http://localhost:3001"+apiCall, '_blank');
    });
}

let saveFile = function(fileTitle, fileContent, fileID, userToken) {
    let options = {
        url: "http://localhost:3001/put/save",
        method: 'POST',
        json: { fileTitle: fileTitle, fileContent: fileContent, fileID:fileID, userToken: userToken }
    }
    request(options, (error, response, body) => {
        let message = response.body.message;
        console.log(message);
    });
}

exports.requestForPdf = requestForPdf;
exports.saveFile = saveFile;

