var MAP_SIZE = 256;
var PARAMS = {
	OCTAVES: 5,
	ROUGHNESS: 7
};

function setSeed( seed ) {
	if ( seed ) {
		noise.seed( seed );
	} else {
		noise.seed( Math.random() * Math.random() );
	}
}

function rngRange( min, max ) {
	return Math.random() * ( max - min ) + min;
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