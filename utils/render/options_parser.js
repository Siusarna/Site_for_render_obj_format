const vec3 = require('./vector3D.js');

function option_parser(obj) {
  const options = {};
  const array_of_coordinate_camera_pos = obj.camera_pos.split(' ');
  options.camera_pos = new vec3(parseFloat(array_of_coordinate_camera_pos[0]), parseFloat(array_of_coordinate_camera_pos[1]), parseFloat(array_of_coordinate_camera_pos[2]), )
  options.width = parseFloat(obj.width);
  options.height = parseFloat(obj.height);
  options.fov = parseFloat(obj.fov);
  let rgb_color_of_objectColor = obj.objectColor.split(' ').map(el => Number(el / 255));
  options.objectColor = new vec3(rgb_color_of_objectColor[0], rgb_color_of_objectColor[1], rgb_color_of_objectColor[2]);
  const rgb_color_of_backgroundColor = obj.backgroundColor.split(' ').map(el => Number(el / 255));
  options.backgroundColor = new vec3(rgb_color_of_backgroundColor[0], rgb_color_of_backgroundColor[1], rgb_color_of_backgroundColor[2]);
  options.bias = 0.2;
  return options;
}

module.exports = option_parser;