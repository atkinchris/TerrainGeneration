function getHeight(x, y) {
  var distanceX = ( 0.5 - x ) * ( 0.5 - x );
  var distanceY = ( 0.5 - y ) * ( 0.5 - y );
  var distanceToCenter = Math.sqrt( distanceX + distanceY );

  return 0.9 - ( distanceToCenter * 2 );
}

export default getHeight;
