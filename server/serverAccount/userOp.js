const googleTokenValidation = require('./googleTokenValidation');
const MongoClient = require('mongodb').MongoClient;
const express = require('express');
const url = "mongodb://localhost:27017/markdown_online";

class User {
    constructor(email, firstName, lastName, picture) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.picture = picture;
        this.files = [];
    }
};

class MarkdownFile {
    constructor(fileTitle, fileContent, fileID, followerIds) {
        this.fileTitle = fileTitle;
        this.fileContent = fileContent;
        this.fileID = fileID;
        this.followerIds = followerIds;
        this.files = [];
    }
}

const getUser = async function (user) {
    const db = await MongoClient.connect(url);
    const result = await db.collection("users").findOne({ 'email': user.email });
    return result;
};
const registerUserInfo = async function (user) {
    const db = await MongoClient.connect(url);
    await db.collection("users").insert(user);
    console.log(user, "inserted");
};

const getUserId = async function (user) {
    // const db = await MongoClient.connect(url);
    // const result = await db.collection("users").findOne({ 'email': user.email });
    // return result._id.toString();
    const dbuser = await getUser(user)
    const id = dbuser._id.toString();
    return id;
};

const getUserEmail = async function (user) {
    // const db = await MongoClient.connect(url);
    // const result = await db.collection("users").findOne({ 'email': user.email });
    // return result._id.toString();
    const dbuser = await getUser(user)
    return dbuser.email
};

const getFile = async function (fileId) {
    const db = await MongoClient.connect(url);
    const result = await db.collection("files").findOne({ 'fileID': fileId });
    return result;
};

const setUpApi = async function (app) {
    app.post('/put/signin', async function (req, res) {
        try {
            console.log("signin" + req.body.userToken);
            let userToken = req.body.userToken;
            let userInfo = googleTokenValidation.getUserInfo(userToken);
            console.log(userInfo);
            if (userInfo.email != null) {
                const user = new User(userInfo.email, userInfo.given_name, userInfo.family_name, userInfo.picture);
                const exist = await getUser(user);
                if (exist == null) {
                    console.log("registering")
                    registerUserInfo(user);
                } else {
                    console.log("user exist");
                }
            }

        } catch (e) {
            console.log(e)
            throw e;
        }

    })




    app.post('/get/files', async function (req, res) {
        try {
            console.log("getfile" + req.body.userToken);
            const userToken = req.body.userToken;
            const userInfo = googleTokenValidation.getUserInfo(userToken);
            if (userInfo.email == null) {
                res.end();
            } else {
                const results = [];
                const db = await MongoClient.connect(url);
                const user = await db.collection("users").findOne({ 'email': userInfo.email });
                for (let i = 0; i < user.files.length; i++) {
                    const currentFileID = user.files[i];
                    const file = await db.collection("files").findOne({ 'fileID': currentFileID });
                    results.push(file);
                }
                res.json(results);
                res.end();
            }
        } catch (e) {
            console.log(e)
            throw e;
        }
    })
    app.post('/put/save', async function (req, res) {
        //TODO: optimize this
        try {
            const userToken = req.body.userToken;
            const fileTitle = req.body.fileTitle;
            const fileContent = req.body.fileContent;
            const fileID = req.body.fileID;
            //console.log(userToken);
            const userInfo = await googleTokenValidation.getUserInfo(userToken);
            console.log("email", userInfo);
            if (userInfo == null) {
                res.json({ message: 'error, user not log in' });
                res.end();
            } else {
                const db = await MongoClient.connect(url);
                const user = await db.collection("users").findOne({ 'email': userInfo.email });
                const userEmail = await getUserEmail(user);
                console.log(user);
                const dbfile = await getFile(fileID)
                if (dbfile) {
                    const db = await MongoClient.connect(url);
                    const followerIds = dbfile.followerIds;
                    dbfile.fileContent = fileContent;
                    dbfile.fileTitle = fileTitle;
                    if (followerIds.includes(userEmail)) {
                        db.collection("files").update({ fileID: fileID }, dbfile);
                    } else {
                        followerIds.push(userEmail);
                        db.collection("files").update({ fileID: fileID }, dbfile);
                        const user = await db.collection('users').findOne({ 'email': userEmail });
                        user.files.push(fileID);
                    }
                } else {
                    const newFile = new MarkdownFile(fileTitle, fileContent, fileID, [userEmail]);
                    console.log(146, newFile);
                    const db = await MongoClient.connect(url);
                    user.files.push(fileID);
                    await db.collection("users").update({ email: userEmail }, user);
                    await db.collection("files").insert(newFile);
                }
                res.send();
                res.end();
            }
        } catch (e) {
            console.log(e);
        }
    })

    app.post('/get/file', async function (req, res) {
        try {
            console.log(req.body);
            const fileID = req.body.fileID;
            const db = await MongoClient.connect(url);
            const file = await db.collection("files").findOne({ 'fileID': fileID });
            console.log(file);
            res.json(file);
            res.end();
        } catch (e) {
            throw e;
        }
    })

    app.post('/delete', async function (req, res) {
        try {
            const fileID = req.body.fileID;
            const email = req.body.email;
            const db = await MongoClient.connect(url);
            const file = await db.collection("users").update({ email: userEmail }, {$pull: {'files': fileID}});
            console.log(file);
            res.json(file);
            res.end();
        } catch (e) {
            throw e;
        }
    })
}

exports.setUpApi = setUpApi;