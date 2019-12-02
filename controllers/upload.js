const render = require('../utils/render/index.js');

const getTimeAndParseOption = (fileName, data) => {
  const options = render.optionParser(data);
  const arrayOfTriangle = render.readOBJ(fileName);
  const sizeOfDate = arrayOfTriangle.length * options.width * options.height;
  const time = (0.0001 * sizeOfDate ** 1.0175) / 1000 / 2; // this digit I get from formula
  const observationalError = time * 0.061;
  return [
    {
      calculatedTime: time,
      observationalError: observationalError.toFixed(1)
    },
    options,
    arrayOfTriangle
  ];
};

const createImage = (fileName, options, data) => {
  const light = render.lightParser(data);
  const imageData = render.startRender(fileName, options, light);
  const dataForSend = {
    data: Buffer.from(imageData).toString('base64')
  };
  return dataForSend;
};

module.exports = {
  getTimeAndParseOption,
  createImage
};
