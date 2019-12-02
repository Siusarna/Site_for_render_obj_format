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

const updateTokensInDB = (payload) => {
  return new Promise((resolve, reject) => {
    Token.findOne({ tokenId: payload.id })
      .exec()
      .then((token) => {
        if (token === null) {
          reject(new Error('Invalid token'));
        }
        resolve(updateTokens(token.userId));
      })
      .catch((err) => {
        reject(new HttpError(400, err.message));
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

const parseConfig = (token) => {
  const time = tokens[token].expiresIn;
  if (time.includes('m')) {
    return time.slice(0, time.length - 1) * 60 * 1000; // minute convert to milisecond
  } else if (time.includes('s')) {
    return time.slice(0, time.length - 1) * 1000; // second convert to milisecond
  }
};

const redirectForSingIN = (req, res) => {
  if (req.method === 'GET') {
    res.redirect('/login');
  } else {
    const objWithRedirect = {
      msg: 'redirect',
      location: '/login'
    };
    res.json(objWithRedirect);
  }
};

const setTokenInCookie = (newTokens, res) => {
  const timeForAccessToken = parseConfig('access');
  const timeForRefreshToken = parseConfig('refresh');
  res
    .status(200)
    .cookie('accessToken', newTokens.accessToken, {
      path: '/',
      expires: new Date(Date.now() + timeForAccessToken)
    })
    .cookie('refreshToken', newTokens.refreshToken, {
      path: '/',
      expires: new Date(Date.now() + timeForRefreshToken)
    });
};

const processingError = async (req, res, status, message) => {
  if (message !== 'Token expired!') {
    return res.redirect('/login');
  }
  refreshToken(req.cookies.refreshToken)
    .then((newTokens) => {
      setTokenInCookie(newTokens, res);
      res.redirect(req.path);
    })
    .catch((e) => {
      redirectForSingIN(req, res);
    });
};

module.exports = {
  updateTokens,
  checkToken,
  refreshToken,
  processingError
};
