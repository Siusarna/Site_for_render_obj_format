const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const multer = require("multer");
const bodyParser = require("body-parser");
const upload = require("./route/upload.js")(app, io);
const path = require("path");

app.use(express.static("public"));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.get("/", (req, res) => {
  res.sendFile(path.resolve("public/html/home.html"));
});

server.listen(3000, () => {
  console.log("ready");
});
