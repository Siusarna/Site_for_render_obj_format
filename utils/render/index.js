const readOBJ = require('./ReadOBJ.js');
const render = require('./rendering.js');
const Saver = require('./writer.js');
const lightParser = require('./lightParser.js');
const optionParser = require('./optionsParser.js');

const startRender = (arrayOfTriangle, options, lights) => {
  const data = render(arrayOfTriangle, lights, options);
  const writer = new Saver(data, options);
  const buffer = writer.encode();
  return buffer;
};

module.exports = {
  startRender,
  optionParser,
  lightParser,
  readOBJ
};
