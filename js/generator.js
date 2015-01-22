var CHUNK_SIZE = 128;
var PARAMS = {
	OCTAVES: 8,
	ROUGHNESS: 4,
	SCALE: 32,
	ROUND: 32,
	PIXELATION: 32
};
var CHUNKS = {};

var _round = Math.round;

function getHash( x, y ) {
	return x << 16 | y;
}

function getX( hash ) {
	return hash >> 16;
}

function getY( hash ) {
	return hash & 0xFFFF;
}

function setSeed( seed ) {
	var H = XXH( 0xABCD );
	noise.seed( H.update( seed ).digest() );
}

function getHeight( x, y ) {
	//x = _round( x / PARAMS.PIXELATION ) * PARAMS.PIXELATION;
	//y = _round( y / PARAMS.PIXELATION ) * PARAMS.PIXELATION;

	x /= PARAMS.SCALE;
	y /= PARAMS.SCALE;

	height = 0;

	for ( var i = 0; i < PARAMS.OCTAVES; i++ ) {
		var frequency = Math.pow( 2, i );
		var amplitude = Math.pow( PARAMS.ROUGHNESS / 10, i );
		height += noise.perlin2( x * frequency, y * frequency ) * amplitude;
	}

	height = Math.abs( height );
	height *= 255;
	height = _round( height / PARAMS.ROUND ) * PARAMS.ROUND;
	return height;
}

function generateChunk( cX, cY ) {
	var chunk = [];
	for ( var y = 0; y < CHUNK_SIZE; y++ ) {
		for ( var x = 0; x < CHUNK_SIZE; x++ ) {
			var height = getHeight( cX * CHUNK_SIZE + x, cY * CHUNK_SIZE + y );
			chunk.push( height );
		}
	}
	return chunk;
}

function getChunk( x, y ) {
	var hash = getHash( x, y );
	var chunk = CHUNKS[ hash ];
	if ( chunk == null ) {
		chunk = generateChunk( x, y );
		CHUNKS[ hash ] = chunk;
	}
	return chunk;
}