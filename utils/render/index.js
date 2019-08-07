const readOBJ = require('./ReadOBJ.js');
const render = require('./rendering.js');
const saver = require('./writer.js');
const vec3 = require('./vector3D.js');
const fs = require('fs');
const ligts = {
  position: new vec3(0, 0, -4),
  intensity: 0.75,
}
const options = {
  camera_pos: new vec3(0, -2, 0),
  width: 300,
  height: 300,
  fov: 150,
  backgroundColor: new vec3(0.3, 0, 0.3),
  bias: 0.75,
  maxDepth: 5,
}
const read = readOBJ('2.obj');
const data = render(read, ligts, options);
const writer = new saver(data, options);
const buffer = writer.encode();
fs.writeFile('result.bmp', buffer, () => {});