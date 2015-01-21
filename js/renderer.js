PIXI.Texture.Draw = function( cb ) {
	var canvas = document.createElement( 'canvas' );
	if ( typeof cb == 'function' ) cb( canvas );
	return PIXI.Texture.fromCanvas( canvas );
}

function getColour( value ) {
	var colour = {};
	colour.r = colour.g = colour.b = value.toString( 16 );
	colour.a = 255;
	return colour;
}

function renderChunk( x, y ) {
	var chunk = getChunk( x, y );
	var chunkSize = Math.sqrt( chunk.length );

	var getCanvas = function( canvas ) {
		canvas.width = chunkSize;
		canvas.height = chunkSize;

		var ctx = canvas.getContext( '2d' );

		ctx.fillStyle = "black";
		ctx.fillRect( 0, 0, canvas.width, canvas.height );

		var pix = ctx.createImageData( canvas.width, canvas.height );

		var length = chunk.length;
		var inc = 0;
		for ( var p = 0; p < length; p++ ) {
			var colourRGBA = getColour( chunk[ p ] );
			pix.data[ inc++ ] = colourRGBA.r;
			pix.data[ inc++ ] = colourRGBA.g;
			pix.data[ inc++ ] = colourRGBA.b;
			pix.data[ inc++ ] = colourRGBA.a;
		}

		ctx.putImageData( pix, 0, 0 );
	};

	var sprite = new PIXI.Sprite( PIXI.Texture.Draw( getCanvas ) );

	sprite.position.x = x * chunkSize;
	sprite.position.y = y * chunkSize;

	return sprite;
}