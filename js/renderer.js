function main() {
	var width = document.body.offsetWidth;
	var height = document.body.offsetHeight;
	var stage = new PIXI.Stage( 0x66FF99 );
	var renderer = new PIXI.autoDetectRenderer( width, height );
	document.body.appendChild( renderer.view );

	requestAnimFrame( animate );
	renderSomeChunks( width, height, stage );

	function renderSomeChunks() {
		setSeed( "Chris" );
		var chunk = renderChunk( 0, 0 );
		stage.addChild( chunk );
	}

	function renderChunk( cX, cY ) {
		var tileSize = 16;

		var chunk = getChunk( cX, cY );
		var chunkSize = Math.sqrt( chunk.length );

		var chunkContainer = new PIXI.DisplayObjectContainer();
		chunkContainer.position.x = cX * chunkSize;
		chunkContainer.position.y = cY * chunkSize;

		for ( var y = 0; y < chunkSize; y++ ) {
			for ( var x = 0; x < chunkSize; x++ ) {
				var height = chunk[ y * chunkSize + x ];
				if ( height <= 6 ) {
					var tile = PIXI.Sprite.fromImage( "img/tiles/water-deep.png" );
				} else if ( height <= 24 ) {
					var tile = PIXI.Sprite.fromImage( "img/tiles/water.png" );
				} else if ( height <= 32 ) {
					var tile = PIXI.Sprite.fromImage( "img/tiles/grass-light.png" );
				} else if ( height <= 64 ) {
					var tile = PIXI.Sprite.fromImage( "img/tiles/grass.png" );
				} else if ( height <= 128 ) {
					var tile = PIXI.Sprite.fromImage( "img/tiles/grass-med.png" );
				} else {
					var tile = PIXI.Sprite.fromImage( "img/tiles/grass-dark.png" );
				}

				tile.position.x = x * tileSize;
				tile.position.y = y * tileSize;
				chunkContainer.addChild( tile );
			}
		}

		return chunkContainer;
	}

	function animate() {
		requestAnimFrame( animate );

		// render the stage
		renderer.render( stage );
	}
}