const authHelper = require('../helpers/authHelper');
require('../models/index.js');
const mongoose = require('mongoose');
const render = require('../utils/render/index.js');
const fs = require('fs');
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
    getInfoFromDbAndRenderPage(res, payload);
  });
};

const deleteModelFromFolder = (name) => {
  fs.unlink(`./uploads/${name}`, (err) => {
    if (err) throw err;
  });
};

const addNewModelInDB = (req, res) => {
  processingAccess(req, res).then((payload) => {
    const { userId } = payload;
    const fileName = req.file.originalname;
    const data = render.readOBJ(fileName);
    deleteModelFromFolder(fileName);
    const model = new Model({
      userId: userId,
      nameOfModel: fileName,
      data: JSON.stringify(data)
    });
    try {
      model.save();
      res.status(200).json('Successfully added');
    } catch (e) {
      res.status(400).json(e);
    }
  });
};

const deletModelByName = (req, res) => {
  processingAccess(req, res).then((payload) => {
    const { userId } = payload;
    const fileName = req.query.nameOfModel;
    const options = {
      userId,
      nameOfModel: fileName
    };
    Model.findOneAndRemove(options)
      .exec()
      .then(() => {
        res.status(200).json('Successfully delete');
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  });
};

module.exports = {
  loadPage,
  addNewModelInDB,
  deletModelByName
};
