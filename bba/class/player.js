phina.define("Player", {
  superClass: 'RectangleShape',
  init: function() {
    this.superInit({
    	width: TILE_SIZE,
    	height: TILE_SIZE,
    	fill: 'transparent',
    	x: MainGridX.span(2),
    	y: MainGridY.span(17),
    	originX: 0,
    	originY: 0
    });
    
    if(DEBUG_MODE) {
    	this.stroke = 'red';
    	this.padding = 0;
    }
    
    this.physical.gravity.set(0, 0.98);
    this.physical.force(20,20);
    var cat = Sprite('cats', TILE_SIZE, TILE_SIZE).addChildTo(this);
    cat.origin.set(0,0);

    var ss = FrameAnimation('cats_ss');
    ss.fit = false;
    ss.attachTo(cat);
    ss.gotoAndPlay('start');
    
    player = this;
  },
});
