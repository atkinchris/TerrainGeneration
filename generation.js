var canvas = document.getElementsByTagName( 'canvas' )[ 0 ];

canvas.width = document.body.offsetWidth;
canvas.height = document.body.offsetHeight;
var ctx = canvas.getContext( '2d' );
var image = ctx.createImageData( canvas.width, canvas.height );
var data = image.data;

function PerlinNoise_2D( x, y, p, n, s ) {
  var total = 0;

  for ( var i = 0; i < n; i++ ) {
    var frequency = Math.pow( 2, i );
    var amplitude = Math.pow( p, i );

    if ( s ) {
      total = total + noise.simplex2( x * frequency, y * frequency ) * amplitude;
    } else {
      total = total + noise.perlin2( x * frequency, y * frequency ) * amplitude;
    };
  }
  return total;
}

function generateNoise() {
  var seed = hashCode( document.getElementById( 'seed-text' ).value );
  var octaves = +document.getElementById( 'octaves' ).value;
  var persistence = +document.getElementById( 'persistence' ).value;
  var mult = +document.getElementById( 'multiplier' ).value;
  var pixel = +document.getElementById( 'pixel' ).value;
  var rounding = +document.getElementById( 'rounding' ).value;
  var seaLevel = +document.getElementById( 'sea-level' ).value;
  var mtnLevel = +document.getElementById( 'mtn-level' ).value;
  var useSimplex = document.getElementById( 'simplex' ).checked;
  noise.seed( seed );

  var start = Date.now();

  for ( var x = 0; x < canvas.width; x += pixel ) {
    for ( var y = 0; y < canvas.height; y += pixel ) {
      var value = Math.abs( PerlinNoise_2D( x / mult, y / mult, persistence, octaves, useSimplex ) );
      value *= 256;

      value = Math.round( value / rounding ) * rounding;

      var cell = ( x + y * canvas.width ) * 4;

      if ( value < seaLevel * 0.6 ) {
        data[ cell + 0 ] = 0;
        data[ cell + 1 ] = 0;
        data[ cell + 2 ] = 128;
      } else if ( value < seaLevel ) {
        data[ cell + 0 ] = 0;
        data[ cell + 1 ] = 0;
        data[ cell + 2 ] = 128 + value;
      } else if ( value < seaLevel + pixel * 2 ) {
        data[ cell + 0 ] = 128 + value * 4;
        data[ cell + 1 ] = 128 + value * 3;
        data[ cell + 2 ] = value - seaLevel;
      } else if ( value > mtnLevel ) {
        data[ cell + 0 ] = value + 64;
        data[ cell + 1 ] = value + 70;
        data[ cell + 2 ] = value + 64;
      } else {
        data[ cell + 0 ] = 0;
        data[ cell + 1 ] = 256 - value;
        data[ cell + 2 ] = value - seaLevel;
      }

      data[ cell + 3 ] = 255; // alpha.

      for ( var pX = 0; pX < pixel; pX++ ) {
        for ( var pY = 0; pY < pixel; pY++ ) {
          var sharedCell = ( x + pX + ( y + pY ) * canvas.width ) * 4;
          for ( var c = 0; c < 4; c++ ) {
            data[ sharedCell + c ] = data[ cell + c ];
          }
        }
      }

    }
  }
  var end = Date.now();

  ctx.fillColor = 'black';
  ctx.fillRect( 0, 0, 100, 100 );
  ctx.putImageData( image, 0, 0 );

  document.getElementById( 'render-time' ).innerHTML = ( end - start ) + ' ms';

  return false;
}

function hashCode( str ) {
  var hash = 0;
  for ( var i = 0; i < str.length; i++ ) {
    hash = str.charCodeAt( i ) + ( ( hash << 5 ) - hash );
  }
  return hash;
}