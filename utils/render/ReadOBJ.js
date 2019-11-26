const fs = require('fs');
const Vec3 = require('./vector3D.js');
const Triangle = require('./triangle.js');

const readOBJ = (name) => {
  const str = fs.readFileSync('./uploads/' + name, 'utf8');
  const triangles = parceReadFile(str.split('\n'));
  return triangles;
};

const parceReadFile = (arr) => {
  const outV = [];
  const outVn = [];
  const outF = [];
  const arrayOfTriangle = [];
  for (let i = 0; i < arr.length; i++) {
    const string = arr[i].split(' ');
    const firstLiteral = string.shift();
    if (firstLiteral === 'v') {
      const vector = new Vec3(
        parseFloat(string[0]),
        parseFloat(string[1]),
        parseFloat(string[2])
      );
      outV.push(vector);
    } else if (firstLiteral === 'vn') {
      const vector = new Vec3(
        parseFloat(string[0]),
        parseFloat(string[1]),
        parseFloat(string[2])
      );
      outVn.push(vector);
    } else if (firstLiteral === 'f') {
      const tempArr = [];
      for (let j = 0; j < string.length; j++) {
        const vertices = string[j].split('/');
        const obj = {
          v: vertices[0] - 1,
          vn: vertices[2] - 1
        };
        tempArr.push(obj);
      }
      outF.push(tempArr);
    }
  }
  for (var i = 0; i < outF.length; i++) {
    const elem = outF[i];
    const tria = new Triangle(
      outV[elem[0].v],
      outV[elem[1].v],
      outV[elem[2].v],
      outVn[elem[0].vn],
      outVn[elem[1].vn],
      outVn[elem[2].vn]
    );
    arrayOfTriangle.push(tria);
  }
  return arrayOfTriangle;
};

module.exports = readOBJ;
