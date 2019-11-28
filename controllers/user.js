const jwt = require('jsonwebtoken');
require('../models/index.js');
const jwtConfig = require('../config/config.js').jwt;
const { secret } = jwtConfig;
const configTokens = jwtConfig.tokens;
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

const parseConfig = (token) => {
  const time = configTokens[token].expiresIn;
  if (time.includes('m')) {
    return time.slice(0, time.length - 1) * 60 * 1000; // minute convert to milisecond
  } else if (time.includes('s')) {
    return time.slice(0, time.length - 1) * 1000; // second convert to milisecond
  }
};

const processingError = async (req, res, status, message) => {
  if (message === 'Token expired!') {
    authHelper
      .refreshToken(req.cookies.refreshToken)
      .then((tokens) => {
        const timeForAccessToken = parseConfig('access');
        const timeForRefreshToken = parseConfig('refresh');
        res
          .status(200)
          .cookie('accessToken', tokens.accessToken, {
            path: '/',
            expires: new Date(Date.now() + timeForAccessToken)
          })
          .cookie('refreshToken', tokens.refreshToken, {
            path: '/',
            expires: new Date(Date.now() + timeForRefreshToken)
          })
          .redirect('/user');
      })
      .catch((e) => {
        console.log(e);
        res.status(e.status).redirect('/login');
      });
  } else {
    console.log(message);
    res.status(status).redirect('/login');
  }
};

const loadPage = (req, res) => {
  const userToken = req.cookies.accessToken;
  try {
    const payload = authHelper.checkToken(userToken);
    getInfoFromDbAndRenderPage(res, payload);
  } catch (err) {
    const { status, message } = err;
    processingError(req, res, status, message);
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
