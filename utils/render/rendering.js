const Vec3 = require('./vector3D.js');
const kEpsilon = 0.000001;

function create2DArray (options) {
  const arr = [];
  for (let i = 0; i < options.height; i++) {
    arr[i] = [];
    for (let j = 0; j < options.width; j++) {
      arr[i][j] = options.backgroundColor;
    }
  }
  return arr;
}

function rayTriangleIntersect (
  orig,
  dir,
  triangle,
  options,
  t = 0,
  u = 0,
  v = 0
) {
  const v0v1 = triangle.v1.minus(triangle.v0);
  const v0v2 = triangle.v2.minus(triangle.v0);
  const pvec = dir.cross(v0v2);
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
  const qvec = tvec.cross(v0v1);
  v = dir.dot(qvec) * invDet;
  if (v < 0 || u + v > 1) {
    return [false, t, u, v];
  }
  t = v0v2.dot(qvec) * invDet;

  return [true, t, u, v];
}

function sceneIntersect (orig, dir, triangle, hit, normal) {
  let temp = false;
  let tnear, u, v;
  let flag = false;
  [flag, tnear, u, v] = rayTriangleIntersect(orig, dir, triangle);
  if (flag) {
    hit = orig.add(dir.multiply(tnear));
    normal = triangle.n0
      .multiply(1 - u - v)
      .add(triangle.n1.multiply(u))
      .add(triangle.n2.multiply(v));
    temp = true;
  }
  return [temp, hit, normal];
}

function castRay (orig, dir, triangle, lights, options) {
  let hit = new Vec3();
  let normal = new Vec3();
  let flag = true;
  [flag, hit, normal] = sceneIntersect(orig, dir, triangle, hit, normal);
  if (!flag) {
    return options.backgroundColor;
  }
  const shadowPointOrig =
    dir.dot(normal) < 0
      ? options.objectColor.add(normal.multiply(options.bias))
      : options.objectColor.minus(normal.multiply(options.bias));
  let diffuseLightIntensity = 0;
  let diffuseLightIntensity2 = 0;
  if (dir.dot(normal) < 0) {
    normal = normal.multiply(-1);
  }
  for (let i = 0; i < lights.length; i++) {
    let shad = false;
    const lightDir = lights[i].position.minus(hit);
    const r2 = lightDir.dot(lightDir);
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
      lights[i].intensity * Math.max(0, normal.dot(lightDir));
    diffuseLightIntensity2 +=
      lights[i].intensity * Math.max(0, normal.dot(lightDir.multiply(-1)));
    // console.log(`normal: ${JSON.stringify(normal)}, lightDir: ${JSON.stringify(lightDir)}, intensity: ${JSON.stringify(lights[i].intensity)}`);
  }
  return options.objectColor.multiply(
    Math.max(diffuseLightIntensity, diffuseLightIntensity2)
  );
}

function render (triangles, lights, options) {
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
}

module.exports = render;
