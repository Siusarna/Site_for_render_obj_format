const Vec3 = require('./vector3D.js');

function optionParser (obj) {
  const options = {};
  const arrayOfCoordinateCameraPos = obj.camera_pos.split(' ');
  options.cameraPos = new Vec3(parseFloat(arrayOfCoordinateCameraPos[0]), parseFloat(arrayOfCoordinateCameraPos[1]), parseFloat(arrayOfCoordinateCameraPos[2]));
  options.width = parseFloat(obj.width);
  options.height = parseFloat(obj.height);
  options.fov = parseFloat(obj.fov);
  const rObjColor = parseInt(obj.objectColor[1] + obj.objectColor[2], 16);
  const gObjColor = parseInt(obj.objectColor[3] + obj.objectColor[4], 16);
  const bObjColor = parseInt(obj.objectColor[5] + obj.objectColor[6], 16);
  options.objectColor = new Vec3(Number(rObjColor), Number(gObjColor), Number(bObjColor));
  const rBackColor = parseInt(obj.backgroundColor[1] + obj.backgroundColor[2], 16);
  const gBackColor = parseInt(obj.backgroundColor[3] + obj.backgroundColor[4], 16);
  const bBackColor = parseInt(obj.backgroundColor[5] + obj.backgroundColor[6], 16);
  options.backgroundColor = new Vec3(Number(rBackColor), Number(gBackColor), Number(bBackColor));
  options.bias = 0.2;
  return options;
}

module.exports = optionParser;
