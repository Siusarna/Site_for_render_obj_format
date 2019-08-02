const fs = require('fs');
const vec3 = require('./vector3D.js');
const triangle = require('./triangle.js');

function readOBJ(name) {
  fs.readFile('../../uploads/' + name, (err, data) => {
    if (err) {
      throw err;
    } else {
      const str = data.toString().split('\n');
      return str;
    }
  })
}

function parceReadFile(arr) {
  const out_v = [];
  const out_vn = [];
  const out_f = [];
  const array_of_triangle = [];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i].search('v') === 0) {
      const string = arr[i].split(' ');
      const vector = new vec3(string[1], string[2], string[3]);
      out_v.push(vector);
    } else if (arr[i].search('vn') === 0) {
      const string = arr[i].split(' ');
      const vector = new vec3(string[1], string[2], string[3]);
      out_vn.push(vector);
    } else if (arr[i].search('f') === 0) {
      const string = arr[i].split(' ');
      for (var i = 0; i < string.length; i++) {
        const temp_arr = [];
        const vertices = string[i].split('//');
        const obj = {
          v: temp_arr[0] - 1,
          vn: temp_arr[1] - 1,
        }
        temp_arr.push(obj);
      }
      out_f.push(temp_arr);
    }
  }
  for (var i = 0; i < out_f.length; i++) {
    const elem = out_f[i];
    const tria = new triangle(out_v[elem[0].v], out_v[elem[1].v], out_v[elem[2].v], out_vn[elem[0].vn], out_vn[elem[1].vn], out_vn[elem[2].vn]);
    array_of_triangle.push(tria);
  }
}
console.log(readOBJ("1.txt"));