phina.define("Player", {
  superClass: 'Sprite',
  init: function() {
    this.superInit('cats');
    
    this.scaleX *= -1;
    this.setPosition(mainGridX.span(5), mainGridY.span(25));
    this.physical.gravity.set(0, 0.98);
    
    var ss = FrameAnimation('cats_ss');
    ss.fit = false;
    ss.attachTo(this);
    ss.gotoAndPlay('start');
    
    player = this;
  }
});
