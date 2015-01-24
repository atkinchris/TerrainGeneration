var MAP_SIZE = 64;
var PARAMS = {
	OCTAVES: 4,
	ROUGHNESS: 7
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
	noise.seed( Math.random() * Math.random() );
	//noise.seed( 10000 );
}

function getHeight( x, y ) {
	x /= MAP_SIZE;
	y /= MAP_SIZE;

	var distanceX = ( 0.5 - x ) * ( 0.5 - x );
	var distanceY = ( 0.5 - y ) * ( 0.5 - y );
	var distanceToCenter = Math.sqrt( distanceX + distanceY );
	distanceToCenter = 0.9 - distanceToCenter * 2;

	height = 0;

	for ( var i = 0; i < PARAMS.OCTAVES; i++ ) {
		var frequency = Math.pow( 2, i );
		var amplitude = Math.pow( PARAMS.ROUGHNESS / 10, i );
		height += noise.perlin2( x * frequency, y * frequency ) * amplitude;
	}

	height = ( height / PARAMS.OCTAVES ) * 8;

	height = Math.abs( height );
	height *= distanceToCenter;
	height *= 255;
	return height;
}

function generateMap() {
	var chunk = [];
	for ( var y = 0; y < MAP_SIZE; y++ ) {
		for ( var x = 0; x < MAP_SIZE; x++ ) {
			var height = getHeight( x, y );
			chunk.push( height );
		}
	}
	return chunk;
}

function getChunk( x, y ) {
	var hash = getHash( x, y );
	var chunk = CHUNKS[ hash ];
	if ( chunk == null ) {
		chunk = generateMap( x, y );
		CHUNKS[ hash ] = chunk;
	}
	return chunk;
}