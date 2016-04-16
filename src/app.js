import Noise from './noise';

const noise = new Noise();
const canvas = document.getElementById('container');
const { height, width } = canvas;
const context = canvas.getContext('2d');
const imageData = context.createImageData(width, height);

function setPixel(imageData, x, y, r, g, b, a) {
  const index = (x + y * imageData.width) * 4;
  imageData.data[index+0] = r;
  imageData.data[index+1] = g;
  imageData.data[index+2] = b;
  imageData.data[index+3] = a;
}

for (let y = 0; y < height; ++y) {
  for (let x = 0; x < width; ++x) {
    const cX = x / width;
    const cY = y / height;
    const value = (noise.perlin2(cX, cY) * 128) + 128;
    setPixel(imageData, x, y, value, value, value, 255);
  }
}

context.putImageData(imageData, 0, 0);

export default noise;
