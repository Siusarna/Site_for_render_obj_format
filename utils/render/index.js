const readOBJ = require('./ReadOBJ.js');
const render = require('./rendering.js');
const saver = require('./writer.js');
const vec3 = require('./vector3D.js');
const fs = require('fs');
const light1 = {
  position: new vec3(0, -3, 0),
  intensity: 0.75,
}
const lights = [light1];
const options = {
  camera_pos: new vec3(0, -2, 0),
  width: 400,
  height: 400,
  fov: 150,
  backgroundColor: new vec3(0.3, 0, 0.3),
  bias: 0.75,
  maxDepth: 5,
}
const read = readOBJ('2.obj');
const data = render(read, lights, options);
const writer = new saver(data, options);
const buffer = writer.encode();
fs.writeFile('result.bmp', buffer, () => {});