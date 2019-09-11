const vec3 = require('./vector3D.js');

function light_parser(obj) {
  const lights = [];
  const light = {};
  const array_of_coordinate = obj.light_pos.split(' ');
  light.position = new vec3(parseFloat(array_of_coordinate[0]), parseFloat(array_of_coordinate[1]), parseFloat(array_of_coordinate[2]));
  light.intensity = parseFloat(obj.light_intensity);
  lights.push(light);
  return lights;
}

module.exports = light_parser;