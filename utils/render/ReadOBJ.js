const fs = require('fs');
const vec3 = require('./vector3D.js');
const triangle = require('./triangle.js');

function readOBJ(name) {
  const str = fs.readFileSync('../../uploads/' + name, 'utf8');
  const triangles = parceReadFile(str.split('\n'));
  return triangles;
}

function parceReadFile(arr) {
  const out_v = [];
  const out_vn = [];
  const out_f = [];
  const array_of_triangle = [];
  for (let i = 0; i < arr.length; i++) {
    const string = arr[i].split(' ');
    const first_literal = string.shift();
    if (first_literal === 'v') {
      const vector = new vec3(parseFloat(string[0]), parseFloat(string[1]), parseFloat(string[2]));
      out_v.push(vector);
      delete vector;
      delete string;
    } else if (first_literal === 'vn') {
      const vector = new vec3(parseFloat(string[0]), parseFloat(string[1]), parseFloat(string[2]));
      out_vn.push(vector);
      delete vector;
      delete string;
    } else if (first_literal === 'f') {
      const temp_arr = [];
      for (let j = 0; j < string.length; j++) {
        const vertices = string[j].split('//');
        const obj = {
          v: vertices[0] - 1,
          vn: vertices[1] - 1,
        }
        temp_arr.push(obj);
        delete obj
      }
      out_f.push(temp_arr);
      delete temp_arr;
    }
  }
  for (var i = 0; i < out_f.length; i++) {
    const elem = out_f[i];
    const tria = new triangle(out_v[elem[0].v], out_v[elem[1].v], out_v[elem[2].v], out_vn[elem[0].vn], out_vn[elem[1].vn], out_vn[elem[2].vn]);
    array_of_triangle.push(tria);
    delete tria;
  }
  return array_of_triangle;
}

module.exports = readOBJ;