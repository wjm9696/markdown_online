let request = require('request-promise');
const config = require('./../config.json');
const serverIP = config.serverIP;
const serverPort = config.serverPort;
const requestForPdf = function (content, userID, fileName) {
    let options = {
        url: `${serverIP}:${serverPort}/get/pdf`,
        method: 'POST',
        json: { content: content, userID: "diuhiu2hedu28d2", fileName: "document" }
    };
    console.log(options);

    request(options, (error, response, body) => {
        let apiCall = response.body.apiCall;
        window.open(`${serverIP}:${serverPort}`+apiCall, '_blank');
    });
}

const saveFile = function(fileTitle, fileContent, fileID, userToken) {
    let options = {
        url: `${serverIP}:${serverPort}/put/save`,
        method: 'POST',
        json: { fileTitle: fileTitle, fileContent: fileContent, fileID:fileID, userToken: userToken }
    }
    return request(options).then((res)=>{
        return res;
    });
}

const getFiles = function(userToken) {
    let options = {
        url: `${serverIP}:${serverPort}/get/files`,
        method: 'POST',
        json: {userToken: userToken}
    }
    return request(options).then((res)=>{
        return res;
    });
}

const getFile = function(fileID) {
    let options = {
        url: `${serverIP}:${serverPort}/get/file`,
        method: 'POST',
        json: {fileID: fileID}
    }
    return request(options).then((res)=>{
        return res;
    });
}

const deleteFile = function(fileID, userToken) {
    let options = {
        url: `${serverIP}:${serverPort}/delete`,
        method: 'POST',
        json: {fileID: fileID,
            userToken: userToken
        }
    }
    return request(options).then((res)=>{
        return res;
    });
}

exports.requestForPdf = requestForPdf;
exports.saveFile = saveFile;
exports.getFile = getFile;
exports.getFiles = getFiles;
exports.deleteFile = deleteFile;


