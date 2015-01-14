var seed = hashCode( "Chris" );
noise.seed( seed );

var parameters = {
	octaves: 8,
	roughness: 0.4,
	zoom: 256,
	rounding: 1
}

function getChunk( x, y ) {
	var chunkSize = 16;

	var chunk = new Array();

	for ( var Y = 0; Y < chunkSize; Y++ ) {
		chunk[ Y ] = new Array();
		for ( var X = 0; X < chunkSize; X++ ) {
			var cell = getValue( x * chunkSize + X, y * chunkSize + Y );
			chunk[ Y ][ X ] = cell;
		}
	}

	return chunk;
}

function getValue( x, y ) {
	var value = 0;

	x /= parameters.zoom;
	y /= parameters.zoom;

	for ( var i = 0; i < parameters.octaves; i++ ) {
		var frequency = Math.pow( 2, i );
		var amplitude = Math.pow( parameters.roughness, i );
		value = value + noise.perlin2( x * frequency, y * frequency ) * amplitude;
	}

	value = Math.abs( value );
	value *= 256;
	value = Math.round( value / parameters.rounding ) * parameters.rounding;
	return value;
}

function hashCode( str ) {
	var hash = 0;
	for ( var i = 0; i < str.length; i++ ) {
		hash = str.charCodeAt( i ) + ( ( hash << 5 ) - hash );
	}
	return hash;
}

function pixiGo() {
	var chunksToLoad = 10;
	var renderer = new PIXI.autoDetectRenderer( chunksToLoad * 16 * 8, chunksToLoad * 16 * 8 );

	document.body.appendChild( renderer.view );

	var stage = new PIXI.Stage( 0xFF0000 );
	var base = new PIXI.DisplayObjectContainer();
	stage.addChild( base );

	for ( var iY = 0; iY < chunksToLoad; iY++ ) {
		for ( var iX = 0; iX < chunksToLoad; iX++ ) {
			base.addChildAt( generateChunkSprite( iX, iY ), 0 );
		};
	};

	// render the stage
	renderer.render( stage );
}

function generateChunkSprite( chunkI, chunkJ ) {
	var CHUNK_SIZE = 16;
	var TILE_SIZE = 16;
	var renderTexture = new PIXI.RenderTexture( CHUNK_SIZE * TILE_SIZE, CHUNK_SIZE * TILE_SIZE );
	var chunkSprite = new PIXI.Sprite( renderTexture );

	chunkSprite.position.x = chunkI * CHUNK_SIZE * TILE_SIZE;
	chunkSprite.position.y = chunkJ * CHUNK_SIZE * TILE_SIZE;

	for ( var X = 0; X < CHUNK_SIZE; X++ ) {
		for ( var Y = 0; Y < CHUNK_SIZE; Y++ ) {
			var cell = getValue( chunkI * CHUNK_SIZE + X, chunkJ * CHUNK_SIZE + Y );
			var graphics = new PIXI.Graphics();
			graphics.beginFill( (cell * 2048) + 204800 );
			graphics.drawRect( X * TILE_SIZE, Y * TILE_SIZE, TILE_SIZE, TILE_SIZE );
			graphics.endFill();
			renderTexture.render( graphics );
		}
	}

	return chunkSprite;
};