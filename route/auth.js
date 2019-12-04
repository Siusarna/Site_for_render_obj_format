const auth = require('../controllers/auth.js');
const reset = require('../controllers/resetPass.js');
module.exports = (app) => {
  app.get('/login/', auth.getLoginPage);
  app.post('/login/', auth.signIn);
  app.get('/signUp/', auth.getSignUpPage);
  app.post('/signUp/', auth.signUp);
  app.get('/login/forgot', reset.getResetPassPage);
  app.post('/login/forgot', reset.forgot);
  app.post('/login/checkToken', reset.checkTokenFromEmail);
  app.post('/login/resetPassword', reset.resetPassword);
};
