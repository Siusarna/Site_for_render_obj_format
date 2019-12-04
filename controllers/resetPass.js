const mongoose = require('mongoose');
require('../models/index.js');
const sha1 = require('sha1');
const nodemailer = require('nodemailer');
const config = require('../config/config.js');
const path = require('path');

const User = mongoose.model('User');

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

const getResetPassPage = (req, res) => {
  res.status(200).sendFile(path.resolve('public', 'html', 'reset.html'));
};

const forgot = (req, res) => {
  const token = createTokenForResetPassword().slice(0, 10);
  const { email } = req.body;
  User.findOneAndUpdate({ email }, { resetPasswordToken: token })
    .exec()
    .then(async (result) => {
      if (!result) {
        res.status(400).json({ message: 'User does not exist!' });
      } else {
        await createAndSendMessageToUserMail(email, token);
        res.status(200).json('OK');
      }
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
        res.status(401).json({ message: 'Input token is not correctly' });
      }
    })
    .catch((error) => {
      res.status(400).json(error);
    });
};

const resetPassword = (req, res) => {
  const { email, pass } = req.body;
  console.log(req.body);
  User.findOneAndUpdate({ email }, { password: pass })
    .exec()
    .then((result) => {
      res.status(200).json('Password successfully changed');
    })
    .catch((error) => {
      res.status(400).json(error);
    });
};
module.exports = {
  forgot,
  checkTokenFromEmail,
  resetPassword,
  getResetPassPage
};
