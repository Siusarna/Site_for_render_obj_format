const multer = require("multer");
const bodyParser = require("body-parser");

module.exports = app => {
  app.use(express.static("public"));
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
  app.use(bodyParser.json()); // to support JSON-encoded bodies
};
