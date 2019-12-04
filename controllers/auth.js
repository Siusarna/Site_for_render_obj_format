const mongoose = require('mongoose');
require('../models/index.js');
// const bCrypt = require('bcrypt');

const authHelper = require('../helpers/authHelper.js');
const path = require('path');

const User = mongoose.model('User');

const signIn = (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .exec()
    .then((user) => {
      if (!user) {
        console.log('!user');
        return res.status(401).json({ message: 'User does not exist!' });
      }
      const isValid = password === user.password;
      if (isValid) {
        authHelper.updateTokens(user._id).then((tokens) => res.json(tokens));
      } else {
        res.status(401).json({ message: 'Invalid credentials!' });
      }
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
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
    user.save();
    res.status(200).send('OK');
  } catch (e) {
    res.status(400).send(e);
  }
};

module.exports = {
  getLoginPage,
  getSignUpPage,
  signIn,
  signUp
};
