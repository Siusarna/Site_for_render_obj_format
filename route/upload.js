const express = require("express");
const multer = require("multer");
const path = require("path");
const render = require("../utils/render/index.js");

module.exports = function(app, io) {
  const storage = multer.diskStorage({
    filename: function(req, file, cb) {
      cb(null, file.originalname);
    },
    destination: function(req, file, cb) {
      cb(null, "uploads");
    }
  });
  const upload = multer({
    storage
  });
  app.use(express.static(path.resolve("./public")));

  app.get("/upload/", (req, res) => {
    res.sendFile(path.resolve("public", "html", "take_file.html"));
    io.on('connection', function(socket){
      console.log('a user connected');
    });
  });
  app.post("/upload/", upload.single("file-to-upload"), (req, res) => {
    const fileName = req.file.originalname;
    const options = render.option_parser(req.body);
    const light = render.light_parser(req.body);
    const image_data = render.startRender(fileName, options, light);
    const data_to_send = {
      data: Buffer.from(image_data).toString("base64")
    };
    res.send(data_to_send);
  });
};
