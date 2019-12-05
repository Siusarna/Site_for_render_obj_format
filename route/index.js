const auth = require('./auth.js');
const upload = require('./upload.js');
const userModels = require('./user_models.js');
const user = require('./user.js');
module.exports = (app, io) => {
  auth(app);
  upload(app, io);
  userModels(app, io);
  user(app);
};
