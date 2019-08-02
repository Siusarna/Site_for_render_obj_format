function Vec3(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
}
Vec3.prototype = {
  dot: function(vec3) {
    return this.x * vec3.x + this.y * vec3.y + this.z * vec3.z;
  },
  cross: function(vec3) {
    return new Vec3(
      this.y * vec3.z - this.z * vec3.y,
      this.z * vec3.x - this.x * vec3.z,
      this.x * vec3.y - this.y * vec3.x
    );
  },
  add: function(vec3) {
    return new Vec3(this.x + vec3.x, this.y + vec3.y, this.z + vec3.z);
  },
  minus: function(vec3) {
    return new Vec3(this.x - vec3.x, this.y - vec3.y, this.z + vec3.z);
  },
  multiply: function(num) {
    return new Vec3(this.x * num, this.y * num, this.z * num);
  },
  length: function() {
    return Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);
  },
  normalize: function() {
    const length = this.length();
    return new Vec3(this.x / length, this.y / length, this.z / length);
  },
}

module.exports = Vec3;