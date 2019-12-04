const mongoose = require('mongoose');
require('../models/index.js');
const sha1 = require('sha1');
const nodemailer = require('nodemailer');
const config = require('../config/config.js');
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

const createTokenForResetPassword = () => {
  const now = Date.now();
  const token = sha1(now);
  return token;
};

const createAndSendMessageToUserMail = async (email, token) => {
  const optionsForSender = {
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: config.email, // generated ethereal user
      pass: config.pass // generated ethereal password
    }
  };
  const transporter = nodemailer.createTransport(optionsForSender);
  const emailOptions = {
    from: `"Siusarna 👻" ${config.email}`, // sender address
    to: `${email}`, // list of receivers
    subject: 'Reset Password ✔', // Subject line
    text: `For reset your password enter this code: ${token}.\nIf you dont use reset password in SiusarnaSite ignore this letter` // plain text body
  };
  const info = await transporter.sendMail(emailOptions);
  return info;
};

const forgot = (req, res) => {
  const token = createTokenForResetPassword().slice(0, 10);
  const { emailForResetPassword } = req.body;
  User.findOneAndUpdate(
    { email: emailForResetPassword },
    { resetPasswordToken: token }
  )
    .exec()
    .then((result) => {
      createAndSendMessageToUserMail(emailForResetPassword, token);
    })
    .then((infoAboutEmail) => {
      res.status(200).json('OK');
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json(error);
    });
};

const checkTokenFromEmail = (req, res) => {
  console.log(req.body);
  const { email, token } = req.body;
  User.findOne({ email })
    .exec()
    .then((result) => {
      if (result.resetPasswordToken === token) {
        res.status(200).json('OK');
      } else {
        res.status(401).json('Input token is not correctly');
      }
    })
    .catch((error) => {
      res.status(400).json(error);
    });
};

const resetPassword = (req, res) => {
  const { email, pass } = req.body;
  User.findOneAndUpdate({ email }, { password: pass })
    .exec()
    .then((result) => {
      res.status(200).json('Password successfully changed');
    })
    .catch((error) => {
      console.log(error);
      res.status(400).json(error);
    });
};
module.exports = {
  getLoginPage,
  getSignUpPage,
  signIn,
  signUp,
  forgot,
  checkTokenFromEmail,
  resetPassword
};
