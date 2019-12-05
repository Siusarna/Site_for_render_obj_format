const user = require('../controllers/user.js');
module.exports = (app) => {
  app.get('/user/', user.loadPage);
  app.get('/logout/', user.logout);
};
