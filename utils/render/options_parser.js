const vec3 = require('./vector3D.js');

function option_parser(obj) {
  const options = {};
  const array_of_coordinate_camera_pos = obj.camera_pos.split(' ');
  options.camera_pos = new vec3(parseFloat(array_of_coordinate_camera_pos[0]), parseFloat(array_of_coordinate_camera_pos[1]), parseFloat(array_of_coordinate_camera_pos[2]), )
  options.width = parseFloat(obj.width);
  options.height = parseFloat(obj.height);
  options.fov = parseFloat(obj.fov);
  const r_obj_color = parseInt(obj.objectColor[1] + obj.objectColor[2], 16);
  const g_obj_color = parseInt(obj.objectColor[3] + obj.objectColor[4], 16);
  const b_obj_color = parseInt(obj.objectColor[5] + obj.objectColor[6], 16);
  options.objectColor = new vec3(Number(r_obj_color), Number(g_obj_color), Number(b_obj_color));
  const r_back_color = parseInt(obj.backgroundColor[1] + obj.backgroundColor[2], 16);
  const g_back_color = parseInt(obj.backgroundColor[3] + obj.backgroundColor[4], 16);
  const b_back_color = parseInt(obj.backgroundColor[5] + obj.backgroundColor[6], 16);
  options.backgroundColor = new vec3(Number(r_back_color), Number(g_back_color), Number(b_back_color));
  options.bias = 0.2;
  return options;
}

module.exports = option_parser;