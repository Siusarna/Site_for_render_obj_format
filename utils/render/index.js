const readOBJ = require('./ReadOBJ.js');
const render = require('./rendering.js');
const Saver = require('./writer.js');
const lightParser = require('./lightParser.js');
const optionParser = require('./optionsParser.js');

function startRender (file, options, lights) {
  const read = readOBJ(file);
  const data = render(read, lights, options);
  const writer = new Saver(data, options);
  const buffer = writer.encode();
  return buffer;
}

module.exports = {
  startRender,
  optionParser,
  lightParser,
  readOBJ
};
