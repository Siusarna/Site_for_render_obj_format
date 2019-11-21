const mongoose = require('mongoose');
require('../models/index.js');
// const bCrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/config.js').jwt;
const authHelper = require('../helpers/authHelper.js');
const path = require('path');

const User = mongoose.model('User');
const Token = mongoose.model('Token');

const updateTokens = (userId) => {
  const accessToken = authHelper.generateAccessToken(userId);
  const refreshToken = authHelper.generateRefreshToken();

  return authHelper.replaceDbRefreshToken(refreshToken.id, userId).then(() => ({
    accessToken,
    refreshToken: refreshToken.token
  }));
};

const signIn = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .exec()
    .then((user) => {
      if (!user) {
        res.status(401).json({ message: 'User does not exist!' });
      }
      const isValid = password === user.password;
      if (isValid) {
        updateTokens(user._id).then((tokens) => res.json(tokens));
      } else {
        res.status(401).json({ message: 'Invalid credentials!' });
      }
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

const getLoginPage = (req, res) => {
  res.status(200).sendFile(path.resolve('public', 'html', 'login.html'));
};

const getSignUpPage = (req, res) => {
  res.status(200).sendFile(path.resolve('public', 'html', 'signUp.html'));
};

const signUp = (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password
  });
  try {
    const savedUser = user.save();
    res.send(savedUser);
  } catch (e) {
    res.status(400).send(e);
  }
};

const refreshToken = (req, res) => {
  const { refreshToken } = req.body;
  let payload;
  try {
    payload = jwt.verify(refreshToken, secret);
    if (payload.type !== 'refresh') {
      res.status(400).json({ message: 'Invalid token' });
      return;
    }
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      res.status(400).json({ message: 'Token expired' });
      return;
    } else if (e instanceof jwt.JsonWebTokenError) {
      res.status(400).json({ message: 'Invalid token' });
      return;
    }
  }
  Token.findOne({ tokenId: payload.id })
    .exec()
    .then((token) => {
      if (token === null) {
        throw new Error('Invalid token');
      }
      return updateTokens(token.userId);
    })
    .then((tokens) => res.json(tokens))
    .catch((err) => res.status(400).json({ message: err.message }));
};

module.exports = {
  getLoginPage,
  getSignUpPage,
  signIn,
  signUp,
  refreshToken
};
