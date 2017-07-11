const googleTokenValidation = require('./googleTokenValidation');
const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const url = "mongodb://localhost:27017/mydb";

class User {
    constructor(email, firstName, lastName, picture) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.picture = picture;
    }
};

class MarkdownFile {
    constructor(fileTitle, fileContent, fileID, followerIds) {
        this.fileTitle = fileTitle;
        this.fileContent = fileContent;
        this.fileID = fileID;
        this.followerIds = followerIds;
    }
}

const getUser = async function(user) {
    const db = await MongoClient.connect(url);
    const result = await db.collection("users").findOne({ 'email': user.email });
    return result;
};
const registerUserInfo = async function(user) {
    const db = await MongoClient.connect(url);
    await db.collection("users").insert(user);
    console.log(user, "inserted");
};

const getUserId = async function(user) {
    // const db = await MongoClient.connect(url);
    // const result = await db.collection("users").findOne({ 'email': user.email });
    // return result._id.toString();
    const dbuser = await getUser(user)
    const id = dbuser._id.toString();
    return id;
};

const getFile = async function(fileId) {
    const db = await MongoClient.connect(url);
    const result = await db.collection("files").findOne({ 'fileID': fileId });
    return result;
};

const setUpApi = async function(app) {
    app.post('/put/signin', function(req, res) {
        let userToken = req.body.userToken;
        let userInfo = googleTokenValidation.getUserInfo(userToken);
        if (userInfo.email != null) {
            const user = new User(userInfo.email, userInfo.given_name, userInfo.family_name, userInfo.picture);
            const result = getUser(user);
            result.then((exist) => {
                if (exist == null) {
                    registerUserInfo(user);
                } else {
                    console.log("user exist");
                }
            })
        }

    })

    app.post('/put/save', async function(req, res) {
        //TODO: optimize this
        const userToken = req.body.userToken;
        const fileTitle = req.body.fileTitle;
        const fileContent = req.body.fileContent;
        const fileID = req.body.fileID;
        const userInfo = googleTokenValidation.getUserInfo(userToken);
        if (userInfo.email == null) {
            res.json({ message: 'error, user not log in' });
            res.end();
        } else {
            const db = await MongoClient.connect(url);
            const user = await db.collection("users").findOne({ 'email': userInfo.email });
            const userID = await getUserId(user);
            console.log(userID);
            const dbfile = await getFile(fileID)
            if(dbfile){
                const db = await MongoClient.connect(url);
                const followerIds = dbfile.followerIds;
                dbfile.fileContent = fileContent;
                dbfile.fileTitle = fileTitle;
                if(followerIds.includes(userID)){
                    db.collection("files").update({fileID: fileID}, dbfile);
                }else{
                    followerIds.push(userID);
                    db.collection("files").update({fileID: fileID}, dbfile);
                }
                console.log(db);
            }else{
                const newFile = new MarkdownFile(fileTitle, fileContent, fileID, [userID]);
                const db = await MongoClient.connect(url);
                await db.collection("files").insert(newFile);
            }
        }
    })
}

exports.setUpApi = setUpApi;