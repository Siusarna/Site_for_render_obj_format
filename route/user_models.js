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

module.exports = (app) => {
  app.get('/model-base/', modelBase.loadPage);
  app.post(
    '/model-base/',
    upload.single('file-to-upload'),
    modelBase.addNewModelInDB
  );
  app.delete('/model-base/', modelBase.deletModelByName);
};
