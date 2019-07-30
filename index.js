const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const upload = require('./route/upload.js');
const path = require('path');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/', (req, res) =>{
  res.sendFile(path.resolve('public/html/home.html'));
})
app.use('/upload', upload);

app.listen(3000, () => {
  console.log('ready');
});
