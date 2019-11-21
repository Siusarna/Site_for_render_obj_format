const express = require('express');
const multer = require('multer');
const path = require('path');
const uploader = require('../controllers/upload.js');

const makeConfigForMulter = () => {
  return {
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
    destination: function (req, file, cb) {
      cb(null, 'uploads');
    }
  };
};

module.exports = function (app, io) {
  const storage = multer.diskStorage(makeConfigForMulter());
  const upload = multer({
    storage
  });
  app.use(express.static(path.resolve('./public')));

  app.get('/upload/', (req, res) => {
    res.sendFile(path.resolve('public', 'html', 'take_file.html'));
  });
  app.post('/upload/', upload.single('file-to-upload'), (req, res) => {
    const fileName = req.file.originalname;
    const [processingTime, options] = uploader.getTimeAndParseOption(fileName, req.body);
    io.sockets.emit('timer', processingTime);
    const dataForSend = uploader.createImage(fileName, options, req.body);
    res.send(dataForSend);
  });
  io.on('connection', function (socket) {});
};
