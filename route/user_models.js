const modelBase = require('../controllers/baseOfModels.js');
const multer = require('multer');
const express = require('express');

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
  const route = express.Router();
  route.use(modelBase.processingAccess);

  route.get('/', modelBase.loadPage);
  route.post(
    '/',
    upload.single('file-to-upload'),
    modelBase.addNewModelInDB
  );
  route.delete('/', modelBase.deletModelByName);
  route.get('/render', modelBase.pageForRender);
  route.post('/render', (req, res) => {
    modelBase.renderModel(req, res, io);
  });

  app.use('/model-base', route);
};
