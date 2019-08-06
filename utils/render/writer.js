const fs = require('fs');

function writeAsBMP(framebuffer, options) {
  this.buffer = framebuffer;
  this.width = options.width;
  this.height = options.height;
  this.extraBytes = this.width % 4;
  this.rgbSize = this.height * (3 * this.width + this.extraBytes);
  this.headerInfoSize = 40;
  this.data = [];

  //*****************Header*********//
  this.flag = 'BM';
  this.reserved = 0;
  this.offset = 54;
  this.fileSize = this.rgbSize + this.offset;
  this.planes = 1;
  this.bitPP = 24;
  this.compress = 0;
  this.hr = 0;
  this.vr = 0;
  this.colors = 0;
  this.importantColors = 0;
}

writeAsBMP.prototype.encode = function() {
  const tempBuffer = Buffer.alloc(this.offset + this.rgbSize);
  this.pos = 0;
  tempBuffer.write(this.flag, this.pos, 2);
  this.pos += 2;
  tempBuffer.writeUInt32LE(this.fileSize, this.pos);
  this.pos += 4;
  tempBuffer.writeUInt32LE(this.reserved, this.pos);
  this.pos += 4;
  tempBuffer.writeUInt32LE(this.offset, this.pos);
  this.pos += 4;
  tempBuffer.writeUInt32LE(this.headerInfoSize, this.pos);
  this.pos += 4;
  tempBuffer.writeUInt32LE(this.width, this.pos);
  this.pos += 4;
  tempBuffer.writeInt32LE(-this.height, this.pos);
  this.pos += 4;
  tempBuffer.writeUInt16LE(this.planes, this.pos);
  this.pos += 2;
  tempBuffer.writeUInt16LE(this.bitPP, this.pos);
  this.pos += 2;
  tempBuffer.writeUInt32LE(this.compress, this.pos);
  this.pos += 4;
  tempBuffer.writeUInt32LE(this.rgbSize, this.pos);
  this.pos += 4;
  tempBuffer.writeUInt32LE(this.hr, this.pos);
  this.pos += 4;
  tempBuffer.writeUInt32LE(this.vr, this.pos);
  this.pos += 4;
  tempBuffer.writeUInt32LE(this.colors, this.pos);
  this.pos += 4;
  tempBuffer.writeUInt32LE(this.importantColors, this.pos);
  this.pos += 4;

  let rowBytes = 3 * this.width + this.extraBytes;

  for (let y = 0; y < this.height; y++) {
    for (let x = 0; x < this.width; x++) {
      let p = this.pos + y * rowBytes + x * 3;
      tempBuffer[p] = this.buffer[y][x].z; //b
      tempBuffer[p + 1] = this.buffer[y][x].y; //g
      tempBuffer[p + 2] = this.buffer[y][x].x; //r
    }
    if (this.extraBytes > 0) {
      let fillOffset = this.pos + y * rowBytes + this.width * 3;
      tempBuffer.fill(0, fillOffset, fillOffset + thos.extraBytes);
    }
  }
  return tempBuffer;
}

module.exports = writeAsBMP;