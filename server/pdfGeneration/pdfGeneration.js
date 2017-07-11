var setUpApi = function(app){
  const markdownpdf = require("markdown-pdf")
    , fs = require("fs.promised/promisify")(require("bluebird"));
  const mkdirp = require('mkdirp');
  const makeid = function () {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < 5; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
  }

  app.post('/get/pdf', function (req, res) {
    console.log("?");
    let contentString = req.body.content;
    let userID = req.body.userID;
    let fileName = req.body.fileName;
    path = "store/markdownStore/" + userID;
    pdfPath = "store/pdfStore/"
    mkdirp(path, async function (err) {
      await fs.writeFile(path + '/' + fileName + ".md", contentString).then(console.log("saved"));
      let fileID = makeid();
      console.log(fileID);
      markdownpdf().from(path + '/' + fileName + ".md").to(pdfPath + '/' + fileID + ".pdf", function () {
        res.json({ apiCall: '/get/pdf/file/' + fileID });
        console.log('converted');
        res.end();
      })
    })
  })

  app.get('/get/pdf/file/:fileID', function (req, res) {
    let fileID = req.param('fileID');
    res.sendfile('store/pdfStore/' + fileID + ".pdf");
  })
}

exports.setUpApi = setUpApi;