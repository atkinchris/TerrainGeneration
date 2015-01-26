function main() {
	var viewSize = Math.min( document.body.offsetWidth, document.body.offsetHeight );
	var stage = new PIXI.Stage( 0xFF4189 );
	PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
	var renderer = new PIXI.autoDetectRenderer( 800, 800 );
	document.getElementById( "canvas-container" ).appendChild( renderer.view );

	// create an array of assets to load
	var assetsToLoader = [ "img/tileset.json" ];
	loader = new PIXI.AssetLoader( assetsToLoader );
	loader.onComplete = onAssetsLoaded
	loader.load();

	function onAssetsLoaded() {
		var mapSprite = getMapSprite();
		stage.addChild( mapSprite );
		//requestAnimFrame( animate );
		renderer.render( stage );
	}

	function getMapSprite() {
		var tileSize = 16;
		var offsetX = 0;
		var offsetY = 0;
		var zoom = 20;
		var width = Math.ceil( 800 / tileSize );
		var height = Math.ceil( 800 / tileSize );

		var map = getTiles( offsetX, offsetY, width * zoom, height * zoom );
		var mapContainer = new PIXI.DisplayObjectContainer();

		width = ( Math.ceil( width / CHUNK_SIZE ) + 1 ) * CHUNK_SIZE;
		height = ( Math.ceil( height / CHUNK_SIZE ) + 1 ) * CHUNK_SIZE;

		mapWidth = map[ 0 ].length - 1;
		mapHeight = map.length - 1;

		for ( var y = 0; y < height; y++ ) {
			for ( var x = 0; x < width; x++ ) {
				if ( x * zoom > mapWidth || y * zoom > mapHeight ) {
					continue;
				}
				var altitude = map[ x * zoom ][ y * zoom ];
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
				tile.position.x = x * tileSize;
				tile.position.y = y * tileSize;
				mapContainer.addChild( tile );
			}
		}

		mapContainer.position.x -= (offsetX % CHUNK_SIZE) * tileSize;
		mapContainer.position.y -= (offsetY % CHUNK_SIZE) * tileSize;

		return mapContainer;
	}

	function animate() {
		requestAnimFrame( animate );

		// render the stage
		renderer.render( stage );
	}
}