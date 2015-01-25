function main() {
	var viewSize = Math.min( document.body.offsetHeight, document.body.offsetWidth );
	var stage = new PIXI.Stage( 0x0E4189 );
	PIXI.scaleModes.DEFAULT = PIXI.scaleModes.NEAREST;
	var renderer = new PIXI.autoDetectRenderer( viewSize, viewSize );
	document.getElementById( "canvas-container" ).appendChild( renderer.view );

	// create an array of assets to load
	var assetsToLoader = [ "img/tileset.json" ];
	loader = new PIXI.AssetLoader( assetsToLoader );
	loader.onComplete = onAssetsLoaded
	loader.load();

	function onAssetsLoaded() {
		var mapSprite = getMapSprite();
		stage.addChild( mapSprite );
		requestAnimFrame( animate );
	}

	function getMapSprite() {
		var tileSize = 16;
		var zoom = 1;
		var offset = 0;
		var map = generateMap( 10000 );
		var mapSize = Math.sqrt( map.length );
		var drawScale = viewSize / mapSize * zoom;

		var mapContainer = new PIXI.DisplayObjectContainer();

		for ( var y = 0; y < viewSize; y += tileSize ) {
			for ( var x = 0; x < viewSize; x += tileSize ) {
				var mX = Math.floor( ( y + offset ) / drawScale );
				var mY = Math.floor( ( x + offset ) / drawScale );
				var height = map[ mY * mapSize + mX ];
				var type = "";
				if ( height <= 6 ) {
					type = "water-deep";
				} else if ( height <= 24 ) {
					type = "water";
				} else if ( height <= 32 ) {
					type = "sand";
				} else if ( height <= 38 ) {
					type = "grass-light";
				} else if ( height <= 50 ) {
					type = "grass";
				} else if ( height <= 96 ) {
					type = "grass-med";
				} else if ( height <= 102 ) {
					type = "grass-dark";
				} else if ( height <= 128 ) {
					type = "stone-brown";
				} else if ( height <= 140 ) {
					type = "stone-light";
				} else {
					type = "stone-grey";
				}

				var tile = PIXI.Sprite.fromImage( type + ".png" );
				tile.position.x = x;
				tile.position.y = y;
				mapContainer.addChild( tile );
			}
		}

		return mapContainer;
	}

	function animate() {
		requestAnimFrame( animate );

		// render the stage
		renderer.render( stage );
	}
}