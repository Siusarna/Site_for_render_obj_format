const bodyParser = require('body-parser');
const express = require('express');
const cookieParser = require('cookie-parser');
module.exports = (app) => {
  app.use(express.static('public'));
  app.use(cookieParser());
  app.set('view engine', 'ejs');
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
  app.use(bodyParser.json()); // to support JSON-encoded bodies
};
