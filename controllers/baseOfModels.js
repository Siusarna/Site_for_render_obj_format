const authHelper = require('../helpers/authHelper');
require('../models/index.js');
const mongoose = require('mongoose');
const render = require('../utils/render/index.js');
const fs = require('fs');
const rayTracing = require('../utils/render/index.js');
const Model = mongoose.model('ThreeDModel');

const getInfoFromDbAndRenderPage = (res, payload = '0') => {
  const { userId } = payload;
  Model.find({ userId })
    .exec()
    .then((result) => {
      res.render('modelsPage/modelsPage', { data: result });
    });
};

const processingAccess = (req, res, next) => {
  const userToken = req.cookies.accessToken;
  return new Promise((resolve, reject) => {
    try {
      const payload = authHelper.checkToken(userToken);
      req.payload = payload;
      next();
    } catch (err) {
      const { status, message } = err;
      reject(authHelper.processingError(req, res, status, message));
    }
  });
};

const loadPage = (req, res) => {
  const { payload } = req;
  getInfoFromDbAndRenderPage(res, payload);
};

const deleteModelFromFolder = (name) => {
  fs.unlink(`./uploads/${name}`, (err) => {
    if (err) throw err;
  });
};

const addNewModelInDB = (req, res) => {
  const { payload } = req;
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
};

const deletModelByName = (req, res) => {
  const { payload } = req;
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
};

const pageForRender = (req, res) => {
  res.render('pageForRender/pageForRender');
};

const getModelFromDB = (nameOfModel, userId) => {
  return new Promise((resolve, reject) => {
    Model.findOne({ nameOfModel, userId })
      .exec()
      .then((result) => {
        resolve(result);
      });
  });
};

const getTimeAndOption = (data, userId) => {
  return new Promise((resolve, reject) => {
    getModelFromDB(data.nameOfModel, userId).then((model) => {
      const arrayOfTriangle = JSON.parse(model.data);
      const options = rayTracing.optionParser(data);
      const countTriangle = arrayOfTriangle.length;
      const sizeOfDate = countTriangle * options.width * options.height;
      const time = (0.0001 * sizeOfDate ** 1.0175) / 1000 / 2; // this digit I get from formula
      const observationalError = time * 0.061;
      resolve([
        {
          calculatedTime: time,
          observationalError: observationalError.toFixed(1)
        },
        options,
        arrayOfTriangle
      ]);
    });
  });
};

const createImage = (threeDModel, options, data) => {
  const light = render.lightParser(data);
  const imageData = render.startRender(threeDModel, options, light);
  const dataForSend = {
    data: Buffer.from(imageData).toString('base64')
  };
  return dataForSend;
};

const renderModel = (req, res, io) => {
  new Promise((resolve, reject) => {
    resolve(getTimeAndOption(req.body, req.payload.userId));
  }).then((result) => {
    const [processingTime, options, arrayOfTriangle] = result;
    io.sockets.emit('timer', processingTime);
    const dataForSend = createImage(arrayOfTriangle, options, req.body);
    res.send(dataForSend);
  });
};

module.exports = {
  loadPage,
  addNewModelInDB,
  deletModelByName,
  pageForRender,
  renderModel,
  processingAccess
};
