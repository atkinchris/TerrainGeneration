function main() {
	var VIEW = {
		WIDTH: document.body.offsetWidth,
		HEIGHT: document.body.offsetHeight
	};
	var TILE_SIZE = 16;
	var stage = new PIXI.Stage( 0x0E4189 );
	PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
	var renderer = new PIXI.autoDetectRenderer( VIEW.WIDTH, VIEW.HEIGHT );
	document.getElementById( "canvas-container" ).appendChild( renderer.view );

	// create an array of assets to load
	var assetsToLoader = [ "img/tileset.json" ];
	loader = new PIXI.AssetLoader( assetsToLoader );
	loader.onComplete = onAssetsLoaded
	loader.load();

	function onAssetsLoaded() {
		var mapSprite = getMapSprite( 256, 256, true );
		stage.addChild( mapSprite );
		//requestAnimFrame( animate );
		renderer.render( stage );
	}

	function getMapSprite( x, y, zoomed ) {
		var offsetX = zoomed ? 0 : x;
		var offsetY = zoomed ? 0 : y;
		var tileSize = zoomed ? TILE_SIZE / 2 : TILE_SIZE;
		var zoom = zoomed ? tileSize : 1;
		var width = Math.ceil( VIEW.WIDTH / tileSize );
		var height = Math.ceil( VIEW.HEIGHT / tileSize );

		var chunks = getChunks( offsetX, offsetY, width, height, zoom );
		var mapContainer = new PIXI.DisplayObjectContainer();

		for ( var c = 0; c < chunks.length; c++ ) {
			var chunkSprite = renderChunk( chunks[ c ], tileSize );
			mapContainer.addChild( chunkSprite );
		};

		var offMapX = ~~( ( VIEW.WIDTH - MAP_SIZE ) / 2 );
		var offMapY = ~~( ( VIEW.HEIGHT - MAP_SIZE ) / 2 );

		mapContainer.position.x = zoomed ? offMapX : -( offsetX * tileSize );
		mapContainer.position.y = zoomed ? offMapY : -( offsetY * tileSize );

		return mapContainer;
	}

	function renderChunk( chunk, tileSize, debug ) {
		var chunkContainer = new PIXI.DisplayObjectContainer();
		var chunkSize = Math.sqrt( chunk.tiles.length );
		chunkContainer.position.x = chunk.x * chunkSize * tileSize;
		chunkContainer.position.y = chunk.y * chunkSize * tileSize;
		if ( debug ) {
			chunkContainer.scale.x = chunkContainer.scale.y = 0.97;
		}

		for ( var i = 0; i < chunk.tiles.length; i++ ) {
			var altitude = chunk.tiles[ i ];

			var type = "";
			if ( altitude <= 6 ) {
				type = "water-deep";
			} else if ( altitude <= 24 ) {
				type = "water";
			} else if ( altitude <= 32 ) {
				type = "sand";
			} else if ( altitude <= 38 ) {
				type = "grass-light";
			} else if ( altitude <= 50 ) {
				type = "grass";
			} else if ( altitude <= 96 ) {
				type = "grass-med";
			} else if ( altitude <= 102 ) {
				type = "grass-dark";
			} else if ( altitude <= 128 ) {
				type = "stone-brown";
			} else if ( altitude <= 140 ) {
				type = "stone-light";
			} else {
				type = "stone-grey";
			}

			var tile = PIXI.Sprite.fromImage( type + ".png" );
			tile.position.x = i % chunkSize * tileSize;
			tile.position.y = ~~( i / chunkSize ) * tileSize;

			chunkContainer.addChild( tile );
		}

		return chunkContainer;
	}

	function animate() {
		requestAnimFrame( animate );

		// render the stage
		renderer.render( stage );
	}
}