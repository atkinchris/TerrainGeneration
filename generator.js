function getHash( x, y ) {
	return x << 16 | y;
}

function getX( hash ) {
	return hash >> 16;
}

function getY( hash ) {
	return hash & 0xFFFF;
}