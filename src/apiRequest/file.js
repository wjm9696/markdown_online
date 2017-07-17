let request = require('request-promise');

const requestForPdf = function (content, userID, fileName) {
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

const saveFile = function(fileTitle, fileContent, fileID, userToken) {
    let options = {
        url: "http://localhost:3001/put/save",
        method: 'POST',
        json: { fileTitle: fileTitle, fileContent: fileContent, fileID:fileID, userToken: userToken }
    }
    return request(options).then((res)=>{
        return res;
    });
}

const getFiles = function(userToken) {
    let options = {
        url: "http://localhost:3001/get/files",
        method: 'POST',
        json: {userToken: userToken}
    }
    return request(options).then((res)=>{
        return res;
    });
}

const getFile = function(fileID) {
    let options = {
        url: "http://localhost:3001/get/file",
        method: 'POST',
        json: {fileID: fileID}
    }
    return request(options).then((res)=>{
        return res;
    });
}

exports.requestForPdf = requestForPdf;
exports.saveFile = saveFile;
exports.getFile = getFile;
exports.getFiles = getFiles;

