const authHelper = require('../helpers/authHelper');
require('../models/index.js');
const mongoose = require('mongoose');
const render = require('../utils/render/index.js');

const Model = mongoose.model('ThreeDModel');

const getInfoFromDbAndRenderPage = (res, payload = '0') => {
  const { userId } = payload;
  Model.find({ userId })
    .exec()
    .then((result) => {
      res.render('modelsPage/modelsPage', { data: result });
    });
};

const processingAccess = (req, res) => {
  const userToken = req.cookies.accessToken;
  return new Promise((resolve, reject) => {
    try {
      const payload = authHelper.checkToken(userToken);
      resolve(payload);
    } catch (err) {
      const { status, message } = err;
      reject(authHelper.processingError(req, res, status, message));
    }
  });
};

const loadPage = (req, res) => {
  processingAccess(req, res).then((payload) => {
    console.log(payload);
    getInfoFromDbAndRenderPage(res, payload);
  });
};

const addNewModelInDB = (req, res) => {
  const payload = processingAccess(req, res);
  const { userId } = payload;
  const fileName = req.file.originalname;
  const data = render.readOBJ(fileName);
  const model = new Model({
    userId: userId,
    modelName: fileName,
    data: data.toString()
  });
  try {
    model.save();
    res.status(200).json('Successfully added');
  } catch (e) {
    res.status(400).send(e);
  }
};

module.exports = {
  loadPage,
  addNewModelInDB
};
