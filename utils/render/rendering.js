const vec3 = require('./vector3D.js')
const kEpsilon = 0.000001;

function create2DArray(options) {
  const arr = [];
  for (let i = 0; i < options.height; i++) {
    arr[i] = [];
    for (let j = 0; j < options.width; j++) {
      arr[i][j] = options.backgroundColor;
    }
  }
  return arr;
}

function fovToRad(fov) {
  let fovInRad = fov / 180 * Math.PI;
  if (fovInRad < Math.PI / 2) fovInRad = Math.PI - fovInRad;
  return fovInRad;
}

function rayDirectionFinder(options, x, y) {
  const yNorm = -(y - options.height / 2) / options.height;
  const widthNorm = (x - options.width / 2) / options.width;
  const realPlaneHeight = Math.tan(options.fovInRad);
  const realPlaneWidth = options.width * realPlaneHeight / options.height;
  const normYZ = new vec3(1, 0, 0);

  let angle = options.camera_dir.acosV(normYZ);
  if (angle > Math.PI / 2) angle = Math.PI - angle;

  const normZ = widthNorm * Math.cos(angle);
  const realPlaneZ = realPlaneWidth * Math.cos(angle);

  const normX = widthNorm * Math.sin(angle);
  const realPlaneX = realPlaneWidth * Math.sin(angle);

  const XYZVector = new vec3(normX * realPlaneX / 2, yNorm * realPlaneHeight / 2, normZ * realPlaneZ / 2);
  const positionOnPlane = options.centerOfScreen.add(XYZVector);
  return positionOnPlane.minus(options.camera_pos);
}

function rayTriangleIntersect(orig, dir, triangle, options, t = 0, u = 0, v = 0) {
  let v0v1 = triangle.v1.minus(triangle.v0);
  let v0v2 = triangle.v2.minus(triangle.v0);
  let pvec = dir.cross(v0v2);
  const det = v0v1.dot(pvec);
  if (det < kEpsilon && det > -kEpsilon) {
    return [false, t, u, v];
  }
  const invDet = 1 / det;
  const tvec = orig.minus(triangle.v0);
  u = tvec.dot(pvec) * invDet;
  if (u < 0 || u > 1) {
    return [false, t, u, v];
  }
  qvec = tvec.cross(v0v1);
  v = dir.dot(qvec) * invDet;
  if (v < 0 || u + v > 1) {
    return [false, t, u, v];
  }
  t = v0v2.dot(qvec) * invDet;

  return [true, t, u, v];
}

function scene_intersect(orig, dir, triangle, hit, normal) {
  let dist_i;
  let temp = false;
  let t, u, v;
  let flag = false;
  [flag, tnear, u, v] = rayTriangleIntersect(orig, dir, triangle)
  if (flag) {
    hit = orig.add(dir.multiply(tnear));
    normal = triangle.n0.multiply(1 - u - v).add(triangle.n1.multiply(u)).add(triangle.n2.multiply(v));
    temp = true;
  }
  return [temp, hit, normal];
}


function castRay(orig, dir, triangle, lights, options) {
  let hit = new vec3();
  let normal = new vec3();
  let flag = true;
  [flag, hit, normal] = scene_intersect(orig, dir, triangle, hit, normal);
  if (!flag) {
    return options.backgroundColor;
  }
  const shadowPointOrig = (dir.dot(normal) < 0) ?
    options.objectColor.add(normal.multiply(options.bias)) :
    options.objectColor.minus(normal.multiply(options.bias));
  let diffuse_light_intensity = 0;
  let diffuse_light_intensity2 = 0;
  if (dir.dot(normal) < 0) {
    normal = normal.multiply(-1);

  }
  for (let i = 0; i < lights.length; i++) {
    let shad = false;
    const light_dir = lights[i].position.minus(hit);
    const r2 = light_dir.dot(light_dir);
    //light_dir.normalize();
    const distance = Math.sqrt(r2);
    light_dir.x /= distance;
    light_dir.y /= distance;
    light_dir.z /= distance;
    //const lDotN = Math.max(0,light_dir.dot(n));
    [shad, t, u, v] = rayTriangleIntersect(shadowPointOrig, light_dir.multiply(), triangle);
    shad = !shad;
    diffuse_light_intensity += lights[i].intensity * Math.max(0, normal.dot(light_dir));
    diffuse_light_intensity2 += lights[i].intensity * Math.max(0, normal.dot(light_dir.multiply(-1)));
    //console.log(`normal: ${JSON.stringify(normal)}, light_dir: ${JSON.stringify(light_dir)}, hit: ${JSON.stringify(hit)}`);
  }
  return new vec3(0.2, 0.5, 0.5).multiply(Math.max(diffuse_light_intensity, diffuse_light_intensity2));

}

function render(triangles, lights, options) {
  framebuffer = create2DArray(options);
  options.camera_dir = options.camera_pos.multiply(-1).normalize();
  options.centerOfScreen = options.camera_pos.add(options.camera_dir);
  options.fovInRad = fovToRad(options.fov);
  for (let i = 0; i < triangles.length; i++) {
    for (let j = 0; j < options.height; j++) {
      for (let k = 0; k < options.width; k++) {
        // const x = (2 * (k + 0.5) / options.width - 1) * Math.tan(options.fov / 2) * options.width / options.height;
        // const z = -(2 * (j + 0.5) / options.height - 1) * Math.tan(options.fov / 2);
        const dir = rayDirectionFinder(options, j, k)
        if (framebuffer[j][k] === options.backgroundColor) {
          framebuffer[j][k] = castRay(options.camera_pos, dir, triangles[i], lights, options);
        }
      }
    }
  }
  return framebuffer;
}

module.exports = render;