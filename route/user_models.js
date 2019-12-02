const modelBase = require('../controllers/BaseOfModels.js');
const multer = require('multer');

const makeConfigForMulter = () => {
  return {
    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
    destination: (req, file, cb) => {
      cb(null, 'uploads');
    }
  };
};

const storage = multer.diskStorage(makeConfigForMulter());
const upload = multer({
  storage
});

module.exports = (app, io) => {
  io.on('connection', (socket) => {});

  app.get('/model-base/', modelBase.loadPage);
  app.post(
    '/model-base/',
    upload.single('file-to-upload'),
    modelBase.addNewModelInDB
  );
  app.delete('/model-base/', modelBase.deletModelByName);
  app.get('/model-base/render', modelBase.pageForRender);
  app.post('/model-base/render', (req, res) => {
    modelBase.renderModel(req, res, io);
  });
};
