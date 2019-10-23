const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server);
const multer = require("multer");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("./models/user.js");
const upload = require("./route/upload.js")(app, io);
const login = require("./route/auth.js")(app);
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

mongoose
  .connect("mongodb://localhost:27017/siteForRenderObj")
  .then(() => server.listen(3000, () => console.log("ready")))
  .catch(() => console.log("Error"));
