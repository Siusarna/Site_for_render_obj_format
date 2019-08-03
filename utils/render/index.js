const readOBJ = require('./ReadOBJ.js');
const render = require('./rendering.js');
const vec3 = require('./vector3D.js');
const ligts = {
  position: new vec3(0, 0, -4),
  intensity: 0.75,
}
const options = {
  camera_pos: new vec3(0, -2, 0),
  width: 200,
  height: 200,
  fov: 150,
  backgroundColor: new vec3(1, 1, 1),
  bias: 0.75,
  maxDepth: 5,
}
console.log(render(readOBJ('2.obj'), ligts, options));