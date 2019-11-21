const express = require('express');
const multer = require('multer');
const path = require('path');
const render = require('../utils/render/index.js');

module.exports = function (app, io) {
  const storage = multer.diskStorage({
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
    destination: function (req, file, cb) {
      cb(null, 'uploads');
    }
  });
  const upload = multer({
    storage
  });
  app.use(express.static(path.resolve('./public')));

  app.get('/upload/', (req, res) => {
    res.sendFile(path.resolve('public', 'html', 'take_file.html'));
  });
  app.post('/upload/', upload.single('file-to-upload'), (req, res) => {
    const fileName = req.file.originalname;
    const options = render.option_parser(req.body);
    const countTriangle = render.readOBJ(fileName).length;
    const sizeOfDate = countTriangle * options.width * options.height;
    const time = (0.0001 * sizeOfDate ** 1.0175) / 1000 / 2;
    const observationalError = time * 0.061;
    io.sockets.emit('timer', {
      calculatedTime: time,
      observationalError: observationalError.toFixed(1)
    });
    const light = render.light_parser(req.body);
    const imageData = render.startRender(fileName, options, light);
    const dataForSend = {
      data: Buffer.from(imageData).toString('base64')
    };
    res.send(dataForSend);
  });
  io.on('connection', function (socket) {});
};
