var seed = hashCode( "" );
noise.seed( seed );

var parameters = {
	octaves: 1,
	roughness: 4,
	zoom: 64,
	rounding: 32
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

	x = Math.round( x / 4 ) * 4;
	y = Math.round( y / 4 ) * 4;

	x /= parameters.zoom;
	y /= parameters.zoom;

	for ( var i = 0; i < parameters.octaves; i++ ) {
		var frequency = Math.pow( 2, i );
		var amplitude = Math.pow( parameters.roughness / 10, i );

		//value += noise.perlin2( x * frequency, y * frequency ) * amplitude;
		value += noise.simplex2( x * frequency, y * frequency ) * amplitude;
	}

	value = Math.abs( value );
	//value *= 8;

	if (value >= 0.3) {
		return 1;
	} else {
		return 0;
	}

	//return ~~value;
}

function hashCode( str ) {
	var hash = 0;
	for ( var i = 0; i < str.length; i++ ) {
		hash = str.charCodeAt( i ) + ( ( hash << 5 ) - hash );
	}
	return hash;
}


function pixiGo() {
	var chunksToLoad = 6;
	var renderer = new PIXI.autoDetectRenderer( chunksToLoad * 8 * 16, chunksToLoad * 8 * 16 );

	document.body.appendChild( renderer.view );

	var stage = new PIXI.Stage( 0xFF0000 );
	var base = new PIXI.DisplayObjectContainer();
	stage.addChild( base );

	for ( var iY = 0; iY < chunksToLoad; iY++ ) {
		for ( var iX = 0; iX < chunksToLoad; iX++ ) {
			//base.addChild( generateChunkSprite( iX, iY ) );
			generateChunkSprite( iX, iY, base );
		};
	};

	// render the stage
	renderer.render( stage );
}

function generateChunkSprite( chunkI, chunkJ, base ) {
	var CHUNK_SIZE = 16;
	var TILE_SIZE = 8;
	var chunkDOC = new PIXI.SpriteBatch();

	var renderTexture = new PIXI.RenderTexture( CHUNK_SIZE * TILE_SIZE, CHUNK_SIZE * TILE_SIZE );
	var colours = getColourRange();

	for ( var X = 0; X < CHUNK_SIZE; X++ ) {
		for ( var Y = 0; Y < CHUNK_SIZE; Y++ ) {
			var cell = getValue( chunkI * CHUNK_SIZE + X, chunkJ * CHUNK_SIZE + Y );
			var type = "";
			if ( cell < parameters.rounding ) {
				type = "water";
			} else if ( cell < parameters.rounding * 1.05 ) {
				type = "sand";
			} else {
				type = "grass";
			}
			var sprite = PIXI.Sprite.fromImage( type + ".png" );
			sprite.position.x = ( X * TILE_SIZE ) + ( chunkI * CHUNK_SIZE * TILE_SIZE );
			sprite.position.y = ( Y * TILE_SIZE ) + ( chunkJ * CHUNK_SIZE * TILE_SIZE );
			sprite.tint = colours[ ~~cell ];
			base.addChild( sprite );
		}
	}

	renderTexture.render( chunkDOC );
	var chunkSprite = new PIXI.Sprite( renderTexture );
	chunkSprite.position.x = chunkI * CHUNK_SIZE * TILE_SIZE;
	chunkSprite.position.y = chunkJ * CHUNK_SIZE * TILE_SIZE;
	return chunkSprite;
};

function getColourRange() {
	var startColor = 0x333333;
	var endColor = 0xFFFFFF;

	var startRed = ( startColor >> 16 ) & 0xFF;
	var startGreen = ( startColor >> 8 ) & 0xFF;
	var startBlue = startColor & 0xFF;

	var endRed = ( endColor >> 16 ) & 0xFF;
	var endGreen = ( endColor >> 8 ) & 0xFF;
	var endBlue = endColor & 0xFF;

	var steps = 6;
	var result = [];

	for ( var i = 0; i < steps; i++ ) {
		var newRed = ( ( steps - 1 - i ) * startRed + i * endRed ) / ( steps - 1 );
		var newGreen = ( ( steps - 1 - i ) * startGreen + i * endGreen ) / ( steps - 1 );
		var newBlue = ( ( steps - 1 - i ) * startBlue + i * endBlue ) / ( steps - 1 );
		var comb = newRed << 16 | newGreen << 8 | newBlue;
		result.push( comb );
	}

	return result;
};