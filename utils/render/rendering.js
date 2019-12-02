/* eslint indent: 0 */
const Vec3 = require('./vector3D.js');
const operation = require('./operationWithVec3.js');
const kEpsilon = 0.000001;

const create2DArray = (options) => {
  const arr = [];
  for (let i = 0; i < options.height; i++) {
    arr[i] = [];
    for (let j = 0; j < options.width; j++) {
      arr[i][j] = options.backgroundColor;
    }
  }
  return arr;
};

const rayTriangleIntersect = (
  orig,
  dir,
  triangle,
  options,
  t = 0,
  u = 0,
  v = 0
) => {
  const v0v1 = operation.minus(triangle.v1, triangle.v0);
  const v0v2 = operation.minus(triangle.v2, triangle.v0);
  const pvec = operation.cross(dir, v0v2);
  const det = operation.dot(v0v1, pvec);
  if (det < kEpsilon && det > -kEpsilon) {
    return [false, t, u, v];
  }
  const invDet = 1 / det;
  const tvec = operation.minus(orig, triangle.v0);
  u = operation.dot(tvec, pvec) * invDet; // aaaa
  if (u < 0 || u > 1) {
    return [false, t, u, v];
  }
  const qvec = operation.cross(tvec, v0v1);
  v = operation.dot(dir, qvec) * invDet; // aaa
  if (v < 0 || u + v > 1) {
    return [false, t, u, v];
  }
  t = operation.dot(v0v2, qvec) * invDet; // aaa

  return [true, t, u, v];
};

const sceneIntersect = (orig, dir, triangle, hit, normal) => {
  let temp = false;
  let tnear, u, v;
  let flag = false;
  [flag, tnear, u, v] = rayTriangleIntersect(orig, dir, triangle);
  if (flag) {
    hit = operation.add(orig, operation.multiply(dir, tnear));
    const temp1 = operation.multiply(triangle.n0, 1 - u - v); // aaaa
    const temp2 = operation.add(temp1, operation.multiply(triangle.n1, u));
    normal = operation.add(temp2, operation.multiply(triangle.n2, v));
    temp = true;
  }
  return [temp, hit, normal];
};

const castRay = (orig, dir, triangle, lights, options) => {
  let hit = new Vec3();
  let normal = new Vec3();
  let flag = true;
  [flag, hit, normal] = sceneIntersect(orig, dir, triangle, hit, normal);
  if (!flag) {
    return options.backgroundColor;
  }
  const shadowPointOrig =
    operation.dot(dir, normal) < 0
      ? operation.add(
          options.objectColor,
          operation.multiply(normal, options.bias)
        )
      : operation.minus(
          options.objectColor,
          operation.multiply(normal, options.bias)
        );
  let diffuseLightIntensity = 0;
  let diffuseLightIntensity2 = 0;
  if (operation.dot(dir, normal) < 0) {
    normal = operation.multiply(normal, -1);
  }
  for (let i = 0; i < lights.length; i++) {
    let shad = false;
    const lightDir = operation.minus(lights[i].position, hit);
    const r2 = operation.dot(lightDir, lightDir);
    // lightDir.normalize();
    const distance = Math.sqrt(r2);
    lightDir.x /= distance;
    lightDir.y /= distance;
    lightDir.z /= distance;
    // const lDotN = Math.max(0,lightDir.dot(n));
    [shad] = rayTriangleIntersect(
      shadowPointOrig,
      lightDir.multiply(),
      triangle
    );
    shad = !shad;
    diffuseLightIntensity +=
      lights[i].intensity * Math.max(0, operation.dot(normal, lightDir));
    diffuseLightIntensity2 +=
      lights[i].intensity *
      Math.max(0, operation.dot(normal, operation.multiply(lightDir, -1)));
    // console.log(`normal: ${JSON.stringify(normal)}, lightDir: ${JSON.stringify(lightDir)}, intensity: ${JSON.stringify(lights[i].intensity)}`);
  }
  return operation.multiply(
    options.objectColor,
    Math.max(diffuseLightIntensity, diffuseLightIntensity2)
  );
};

const render = (triangles, lights, options) => {
  const framebuffer = create2DArray(options);
  for (let j = 0; j < options.height; j++) {
    for (let k = 0; k < options.width; k++) {
      const x =
        (((2 * (k + 0.5)) / options.width - 1) *
          Math.tan(options.fov / 2) *
          options.width) /
        options.height;
      const z =
        -((2 * (j + 0.5)) / options.height - 1) * Math.tan(options.fov / 2);
      const dir = new Vec3(x, -1, z);
      for (var i = 0; i < triangles.length; i++) {
        // const dir = rayDirectionFinder(options, j, k)
        if (framebuffer[j][k] === options.backgroundColor) {
          framebuffer[j][k] = castRay(
            options.cameraPos,
            dir,
            triangles[i],
            lights,
            options
          );
        }
      }
    }
  }
  return framebuffer;
};

module.exports = render;
