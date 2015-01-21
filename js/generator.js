var CHUNK_SIZE = 16;
var PARAMS = {
	OCTAVES: 8,
	ROUGHNESS: 4,
	SCALE: 512,
	ROUND: 32
};
var CHUNKS = {};

function getHash( x, y ) {
	return x << 16 | y;
}

function getX( hash ) {
	return hash >> 16;
}

function getY( hash ) {
	return hash & 0xFFFF;
}

function getValue( x, y ) {
	x /= PARAMS.SCALE;
	y /= PARAMS.SCALE;

	value = 0;

	for ( var i = 0; i < PARAMS.OCTAVES; i++ ) {
		var frequency = Math.pow( 2, i );
		var amplitude = Math.pow( PARAMS.ROUGHNESS / 10, i );
		value += noise.perlin2( x * frequency, y * frequency ) * amplitude;
	}

	value = Math.abs( value );
	value *= 256;
	value = Math.round( value / PARAMS.ROUND ) * PARAMS.ROUND;
	return value;
}

function generateChunk( cX, cY ) {
	var chunk = [];
	for ( var y = 0; y < CHUNK_SIZE; y++ ) {
		for ( var x = 0; x < CHUNK_SIZE; x++ ) {
			var value = getValue( cX + x, cY + y );
			chunk.push( value );
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