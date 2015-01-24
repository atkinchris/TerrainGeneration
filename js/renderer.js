function main() {
	var viewSize = Math.min( document.body.offsetHeight, document.body.offsetWidth );
	var stage = new PIXI.Stage( 0x66FF99 );
	var renderer = new PIXI.autoDetectRenderer( viewSize, viewSize );
	document.body.appendChild( renderer.view );

	requestAnimFrame( animate );

	var mapSprite = getMapSprite();

	stage.addChild( mapSprite );

	function getMapSprite() {
		var tileSize = 16;
		var map = generateMap();
		var mapSize = Math.sqrt( map.length );
		var drawScale = viewSize / mapSize;

		var mapContainer = new PIXI.DisplayObjectContainer();

		for ( var y = 0; y < viewSize; y += tileSize ) {
			for ( var x = 0; x < viewSize; x += tileSize ) {
				var mX = Math.floor( y / drawScale );
				var mY = Math.floor( x / drawScale );
				var height = map[ mY * mapSize + mX ];
				var type = "";
				if ( height <= 6 ) {
					type = "water-deep";
				} else if ( height <= 24 ) {
					type = "water";
				} else if ( height <= 32 ) {
					type = "grass-light";
				} else if ( height <= 64 ) {
					type = "grass";
				} else if ( height <= 128 ) {
					type = "grass-med";
				} else {
					type = "grass-dark";
				}

				var tile = PIXI.Sprite.fromImage( "img/tiles/" + type + ".png" );
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