const vec3 = require('./vector3D.js')
const kEpsilon = 1e-8;

function create2DArray(rows) {
  const arr = [];
  for (let i = 0; i < rows; i++) {
    arr[i] = [];
  }
  return arr;
}


function rayTriangleIntersect(orig, dir, triangle, t, u, v) {
  let v0v1 = triangle.v1.minus(triangle.v0);
  let v0v2 = triangle.v2.minus(triangle.v0);
  let pvec = dir.cross(v0v2);
  const det = v0v1.dot(pvec);
  if (det < kEpsilon && det > -kEpsilon) {
    return false;
  }
  const invDet = 1 / det;
  const tvec = orig.minus(triangle.v0);
  u = tvec.dot(pvec) * invDet;
  if (u < 0 || u > 1) {
    return false;
  }
  qvec = tvec.cross(v0v1);
  v = dir.dot(qvec) * invDet;
  if (v < 0 || u + v > 1) {
    return false;
  }
  return true;
}

function scene_intersect(orig, dir, triangle, hit, n) {
  let dist_i;
  let temp = false;
  let t, u, v;
  if (rayTriangleIntersect(orig, dir, triangle, t, u, v)) {
    hit = orig.add(dir.multiply(t));
    n = triangle.n0.multiply(1 - u - v) + triangle.n1.multiply(u) + triangle.n2.multiply(v);
    temp = true;
  }
  return temp;
}


function castRay(orig, dir, triangle, lights, options) {
  const point = new vec3();
  const n = new vec3();
  if (scene_intersect(orig, dir, triangle, point, n)) {
    return options.backgroundColor;
  }
  let diffuse_light_intensity = 0;
  let shad = true;
  for (let i = 0; i < lights.length; i++) {
    const light_dir = point.minus(lights[i].position);
    const r2 = light_dir.normalize() ** 2;
    const distance = Math.sqrt(r2);
    light_dir.x /= distance;
    light_dir.y /= distance;
    light_dir.z /= distance;
    let t, u, v;
    shad = !rayTriangleIntersect(point + n * options.bias, -light_dir, triangle, t, u, v);
    diffuse_light_intensity += shad * lights[i].intensity * Math.max(0, n.dot(light_dir));
  }
  return diffuse_light_intensity;
}

function render(triangles, lights, options) {
  framebuffer = create2DArray(options.height);
  for (let i = 0; i < triangles.length; i++) {
    for (let j = 0; j < options.height; j++) {
      for (let k = 0; k < options.width; k++) {
        const x = (2 * (i + 0.5) / options.width - 1) * Math.tan(options.fov / 2) * options.width / options.height;
        const z = -(2 * (j + 0.5) / options.height - 1) * Math.tan(options.fov / 2);
        const dir = new vec3(x, -1, z).normalize();
        if (framebuffer[j][k] === options.backgroundColor) {
          framebuffer[j][k] = castRay(options.camera_pos, dir, triangles[i], lights, options);
        }
      }
    }
  }
  return framebuffer;
}

module.exports = render;