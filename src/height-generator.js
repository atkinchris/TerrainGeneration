import Noise from './noise';

const noise = new Noise();
const params = {
  OCTAVES: 5,
  ROUGHNESS: 7
};

function getHeight(x, y, width, height) {
  const cX = x / width;
  const cY = y / height;
  let h = 0;

  for ( var i = 0; i < params.OCTAVES; i++ ) {
    var frequency = Math.pow( 2, i );
    var amplitude = Math.pow( params.ROUGHNESS / 10, i );
    h += noise.perlin2( cX * frequency, cY * frequency ) * amplitude;
  }

  const value = (h * 128) + 128;

  return value;
}

export default getHeight;
