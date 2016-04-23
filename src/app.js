import Noise from './noise';

const noise = new Noise();
const canvas = document.getElementById('container');
const { height, width } = canvas;
const context = canvas.getContext('2d');
const imageData = context.createImageData(width, height);
const params = {
  OCTAVES: 5,
  ROUGHNESS: 7
};

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
    let h = 0;

    for ( var i = 0; i < params.OCTAVES; i++ ) {
      var frequency = Math.pow( 2, i );
      var amplitude = Math.pow( params.ROUGHNESS / 10, i );
      h += noise.perlin2( cX * frequency, cY * frequency ) * amplitude;
    }

    const value = (h * 128) + 128;
    setPixel(imageData, x, y, value, value, value, 255);
  }
}

context.putImageData(imageData, 0, 0);

export default noise;
