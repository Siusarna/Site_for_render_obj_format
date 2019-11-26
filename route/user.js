const user = require('../controllers/user.js');
// const auth = require('../controllers/auth.js');
module.exports = (app) => {
  app.get('/user/', user.loadPage);
  app.get('/logout/', user.logout);
  // app.get('/user/check-token', user.checkToken);
  // app.post('/user/refreshTokens', auth.refreshToken);
};
