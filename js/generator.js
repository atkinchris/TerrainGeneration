var CHUNK_SIZE = 32;
var CHUNK_COUNT = 32;
var MAP_SIZE = CHUNK_SIZE * CHUNK_COUNT;
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
	noise.seed( seed || Math.random() * Math.random() );
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

function getChunks( x, y, width, height, zoom ) {
	setSeed( 10000 );

	var padding = 1;

	var cX = Math.floor( x / CHUNK_SIZE ) - padding;
	var cWidth = Math.ceil( width / CHUNK_SIZE ) + padding + 1;

	var cY = Math.floor( y / CHUNK_SIZE ) - padding;
	var cHeight = Math.ceil( height / CHUNK_SIZE ) + padding + 1;

	var chunks = [];

	for ( var iY = 0; iY < cHeight; iY++ ) {
		for ( var iX = 0; iX < cWidth; iX++ ) {
			var chunkX = cX + iX;
			var chunkY = cY + iY;
			var hash = getHash( chunkX, chunkY );
			var chunk = CHUNKS[ hash ];
			if ( !chunk ) {
				chunk = generateChunk( chunkX, chunkY, zoom );
				CHUNKS[ hash ] = chunk;
			}
			chunks.push( {
				x: chunkX,
				y: chunkY,
				tiles: chunk
			} );
		}
	}

	return chunks;
}

function generateChunk( cX, cY, zoom ) {
	var tiles = [];

	for ( var y = 0; y < CHUNK_SIZE; y++ ) {
		for ( var x = 0; x < CHUNK_SIZE; x++ ) {
			var height = getHeight( ( cX * CHUNK_SIZE + x ) * zoom, ( cY * CHUNK_SIZE + y ) * zoom );
			tiles.push( height );
		}
	}

	return tiles;
}