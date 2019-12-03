const auth = require('../controllers/auth.js');

module.exports = (app) => {
  app.get('/login/', auth.getLoginPage);
  app.post('/login/', auth.signIn);
  app.get('/signUp/', auth.getSignUpPage);
  app.post('/signUp/', auth.signUp);
  app.post('/login/forgot', auth.forgot);
  app.post('/login/checkToken', auth.checkTokenFromEmail);
  app.post('/login/resetPassword', auth.resetPassword);
};
