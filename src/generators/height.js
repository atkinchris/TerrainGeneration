import Noise from '../utilities/noise';

const noise = new Noise();
const params = {
  OCTAVES: 5,
  ROUGHNESS: 7
};

function getHeight(x, y) {
  let h = 0;

  for ( var i = 0; i < params.OCTAVES; i++ ) {
    var frequency = Math.pow( 2, i );
    var amplitude = Math.pow( params.ROUGHNESS / 10, i );
    h += noise.perlin2( x * frequency, y * frequency ) * amplitude;
  }

  return ( h + 1 ) / 2;
}

export default getHeight;
