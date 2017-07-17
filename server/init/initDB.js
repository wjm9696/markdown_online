var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/markdown_online";

MongoClient.connect(url, async function(err, db) {
  if (err) throw err;
  await db.createCollection("users");
  await db.createCollection("files");
  db.close();
});