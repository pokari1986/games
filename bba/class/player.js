phina.define("Player", {
  superClass: 'Sprite',
  init: function() {
    this.superInit('cats', TILE_SIZE, TILE_SIZE);

    this.setPosition(MainGridX.span(2), MainGridY.span(TILE_ROW_NUM) - GROUND_HEIGHT);
    this.physical.gravity.set(0, 0.98);
    
    var ss = FrameAnimation('cats_ss');
    ss.fit = false;
    ss.attachTo(this);
    ss.gotoAndPlay('start');
    
    player = this;
  }
});
