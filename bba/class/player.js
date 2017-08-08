phina.define("Player", {
  superClass: 'RectangleShape',
  init: function() {
    this.superInit({
    	width: TILE_SIZE,
    	height: TILE_SIZE,
    	fill: 'transparent',
    	x: MainGridX.span(2),
    	y: MainGridY.span(TILE_ROW_NUM) - GROUND_HEIGHT
    });
    
    if(DEBUG_MODE) this.stroke = 'red';
    
    this.physical.gravity.set(0, 0.98);
    
    var cat = Sprite('cats', TILE_SIZE, TILE_SIZE).addChildTo(this);

    var ss = FrameAnimation('cats_ss');
    ss.fit = false;
    ss.attachTo(cat);
    ss.gotoAndPlay('start');
    
    player = this;
  }
});
