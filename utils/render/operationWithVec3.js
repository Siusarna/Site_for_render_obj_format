const Vec3 = require('./vector3D.js');

const clone = (vec3) => {
  return new Vec3(vec3.x, vec3.y, vec3.z);
};

const dot = (vec31, vec32) => {
  return vec31.x * vec32.x + vec31.y * vec32.y + vec31.z * vec32.z;
};

const cross = (vec31, vec32) => {
  return new Vec3(
    vec31.y * vec32.z - vec31.z * vec32.y,
    vec31.z * vec32.x - vec31.x * vec32.z,
    vec31.x * vec32.y - vec31.y * vec32.x
  );
};

const add = (vec31, vec32) => {
  return new Vec3(vec31.x + vec32.x, vec31.y + vec32.y, vec31.z + vec32.z);
};
const minus = (vec31, vec32) => {
  return new Vec3(vec31.x - vec32.x, vec31.y - vec32.y, vec31.z - vec32.z);
};
const multiply = (vec31, num) => {
  return new Vec3(vec31.x * num, vec31.y * num, vec31.z * num);
};
const length = (vec31) => {
  return Math.sqrt(vec31.x ** 2 + vec31.y ** 2 + vec31.z ** 2);
};
const normalize = (vec31) => {
  const length = vec31.length();
  return new Vec3(vec31.x / length, vec31.y / length, vec31.z / length);
};
const acosV = (vec31, second) => {
  return Math.acos(vec31.dot(second) / (vec31.length() * second.length()));
};

module.exports = {
  clone,
  dot,
  cross,
  add,
  minus,
  multiply,
  length,
  normalize,
  acosV
};
