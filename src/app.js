import HeightGen from './height-generator';

const canvas = document.getElementById('container');
const { height, width } = canvas;
const context = canvas.getContext('2d');
const imageData = context.createImageData(width, height);

function setPixel(imageData, x, y, r, g, b, a = 255) {
  const index = (x + y * imageData.width) * 4;
  imageData.data[index+0] = r;
  imageData.data[index+1] = g;
  imageData.data[index+2] = b;
  imageData.data[index+3] = a;
}

for (let y = 0; y < height; ++y) {
  for (let x = 0; x < width; ++x) {
    const value = HeightGen(x, y, width, height);
    setPixel(imageData, x, y, value, value, value);
  }
}

context.putImageData(imageData, 0, 0);
