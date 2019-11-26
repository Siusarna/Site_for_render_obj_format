const Vec3 = require('./vector3D.js');

function lightParser (obj) {
  const lights = [];
  const light = {};
  const arrayOfCoordinate = obj.light_pos.split(' ');
  light.position = new Vec3(parseFloat(arrayOfCoordinate[0]), parseFloat(arrayOfCoordinate[1]), parseFloat(arrayOfCoordinate[2]));
  light.intensity = parseFloat(obj.light_intensity);
  lights.push(light);
  return lights;
}

module.exports = lightParser;
