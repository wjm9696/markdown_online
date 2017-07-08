var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/markdown_online";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.createCollection("users", function(err, res) {
    if (err) throw err;
    console.log("Table users created!");
    db.close();
  });
});