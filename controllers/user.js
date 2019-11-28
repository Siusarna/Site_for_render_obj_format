const jwt = require('jsonwebtoken');
require('../models/index.js');
const jwtConfig = require('../config/config.js').jwt;
const { secret } = jwtConfig;
const mongoose = require('mongoose');
const authHelper = require('../helpers/authHelper.js');

const User = mongoose.model('User');
const Token = mongoose.model('Token');

const getInfoFromDbAndRenderPage = (res, payload) => {
  const { userId } = payload;
  User.findOne({ _id: userId })
    .exec()
    .then((user) => {
      res.render('personalPage/personalPage', { name: user.name });
    });
};

const loadPage = (req, res) => {
  const userToken = req.cookies.accessToken;
  try {
    const payload = authHelper.checkToken(userToken);
    getInfoFromDbAndRenderPage(res, payload);
  } catch (err) {
    const { status, message } = err;
    authHelper.processingError(req, res, status, message);
  }
};

const logout = (req, res) => {
  const userRefreshToken = req.cookies.refreshToken;
  const { id } = jwt.verify(userRefreshToken, secret);
  Token.deleteOne({ tokenId: id })
    .exec()
    .then(() => {
      res.clearCookie('accessToken', { path: '/' });
      res.clearCookie('refreshToken', { path: '/' });
      res.status(200).end();
    })
    .catch((err) => {
      res.status(401).json(err.message);
    });
};

module.exports = {
  loadPage,
  logout
};
