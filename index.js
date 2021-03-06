const path = require('path');
const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

const mongoose = require('mongoose');
require('./models/user.js');

require('./config/app.js')(app);
const config = require('./config/config.js');

require('./route/index.js')(app, io);

app.get('/', (req, res) => {
  res.sendFile(path.resolve('public/html/home.html'));
});

mongoose
  .connect(config.mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => server.listen(config.appPort, () => console.log('ready')))
  .catch((err) => console.log(err));
