const uuid = require("uuid/v4");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { secret, tokens } = require("../config.js").jwt;

const Token = mongoose.model("Token");

const generateAccessToken = userId => {
  const payload = {
    userId,
    type: tokens.access.type
  };
  const options = { expiresIn: tokens.access.expiresIn };
  return jwt.sign(payload, secret, options);
};

const generateRefreshToken = () => {
  const payload = {
    id: uuid(),
    type: tokens.refresh.type
  };
  const options = { expiresIn: tokens.refresh.expiresIn };
  return {
    token: jwt.sign(payload, secret, options),
    id: payload.id
  };
};

const replaceDbRefreshToken = (tokenId, userId) =>
  Token.findOneAndRemove({ userId })
    .exec()
    .then(() => Token.create({ tokenId, userId }));

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  replaceDbRefreshToken
};
