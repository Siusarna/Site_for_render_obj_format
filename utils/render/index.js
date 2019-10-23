const readOBJ = require('./ReadOBJ.js');
const render = require('./rendering.js');
const saver = require('./writer.js');
const light_parser = require('./light_parser.js');
const option_parser = require('./options_parser.js');
const vec3 = require('./vector3D.js');
const fs = require('fs');

function startRender(file, options, lights) {
  const read = readOBJ(file);
  const data = render(read, lights, options);
  const writer = new saver(data, options);
  const buffer = writer.encode();
  return buffer;
}

module.exports = {
  startRender,
  option_parser,
  light_parser,
  readOBJ,
};
