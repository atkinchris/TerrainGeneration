var CHUNK_SIZE = 32;
var MAP_SIZE = CHUNK_SIZE * 16;
var PARAMS = {
	OCTAVES: 5,
	ROUGHNESS: 7
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

function setSeed( seed ) {
	if ( seed ) {
		noise.seed( seed );
	} else {
		noise.seed( Math.random() * Math.random() );
	}
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
	height = Math.max( 0, height );
	height = Math.floor( height );
	return height;
}

function getTiles( x, y, width, height ) {
	var cX = Math.floor( x / CHUNK_SIZE );
	var cWidth = Math.ceil( width / CHUNK_SIZE );

	var cY = Math.floor( y / CHUNK_SIZE );
	var cHeight = Math.ceil( height / CHUNK_SIZE );

	var chunks = [];
	for ( var iY = 0; iY < cHeight; iY++ ) {
		for ( var iX = 0; iX < cWidth; iX++ ) {
			var chunkX = cX + iX;
			var chunkY = cY + iY;
			var hash = getHash( chunkX, chunkY );
			var chunk = CHUNKS[ hash ];
			if ( !chunk ) {
				chunk = generateChunk( chunkX, chunkY );
				CHUNKS[ hash ] = chunk;
			}
			chunks.push.apply( chunks, chunk );
		}
	}

	return chunks;
}

function generateChunk( cX, cY ) {
	var tiles = [];

	for ( var y = 0; y < CHUNK_SIZE; y++ ) {
		for ( var x = 0; x < CHUNK_SIZE; x++ ) {
			var height = getHeight( x, y );
			tiles.push( height );
		}
	}

	return tiles;
}

function generateMap( seed ) {
	setSeed( seed );
	var tiles = [];

	for ( var y = 0; y < MAP_SIZE; y++ ) {
		for ( var x = 0; x < MAP_SIZE; x++ ) {
			var height = getHeight( x, y );
			tiles.push( height );
		}
	}

	return tiles;
}