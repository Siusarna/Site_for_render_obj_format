const modelBase = require('../controllers/modelBase.js');

module.exports = (app) => {
  app.get('/model-base/', modelBase.loadPage);
};
