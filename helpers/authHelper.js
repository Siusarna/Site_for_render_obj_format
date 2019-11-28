const uuid = require('uuid/v4');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { secret, tokens } = require('../config/config.js').jwt;
const HttpError = require('./httpError.js');

const Token = mongoose.model('Token');

const generateAccessToken = (userId) => {
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

const updateTokens = (userId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken();
  return replaceDbRefreshToken(refreshToken.id, userId).then(() => ({
    accessToken,
    refreshToken: refreshToken.token
  }));
};

const checkToken = (accessToken) => {
  if (!accessToken) {
    throw new HttpError(401, 'Token expired!');
  }
  let payload;
  try {
    payload = jwt.verify(accessToken, secret);
  } catch (e) {
    throw new HttpError(400, 'Token expired!');
  }
  if (payload.type !== 'access') {
    throw new HttpError(400, 'Invalid token!');
  }
  return payload;
};

const updateTokensInDB = async (payload) => {
  return new Promise((resolve, reject) => {
    Token.findOne({ tokenId: payload.id })
      .exec()
      .then(async (token) => {
        if (token === null) {
          throw new Error('Invalid token');
        }
        resolve(updateTokens(token.userId));
      })
      .catch((err) => {
        throw new HttpError(400, err.message);
      });
  });
};

const refreshToken = async (refreshToken) => {
  let payload;
  try {
    payload = jwt.verify(refreshToken, secret);
    if (payload.type !== 'refresh') {
      throw new HttpError(400, 'Invalid token');
    }
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      throw new HttpError(400, 'Token expired');
    } else if (e instanceof jwt.JsonWebTokenError) {
      throw new HttpError(400, 'Invalid token');
    }
  }
  const tokens = await updateTokensInDB(payload);
  return tokens;
};

module.exports = {
  updateTokens,
  checkToken,
  refreshToken
};
