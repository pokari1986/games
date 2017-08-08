phina.define("Hammer", {
  superClass: 'RectangleShape',
  init: function() {
    this.superInit({
    	width: TILE_SIZE*2,
    	height: TILE_SIZE * 3,
    	fill: 'transparent',
    	stroke: 'transparent',
    	originX: 0.5,
    	originY: 0.8
    });
    if(DEBUG_MODE) this.stroke = 'green';
    
	var hammer = Sprite('hammer', this.width, this.height).addChildTo(this);
    hammer.origin = this.origin;
  },
  attack: function(){
    var hit_area = HitArea(this.x + this.width, this.y, this.width, this.height).addChildTo(this.parent);
    this.tweener.rotateTo(120, 100).call(function(){
		hammer = Hammer().addChildTo(this.parent);
		SoundManager.play('se1');
      }, this).to({alpha:0}, 400, 'easing').call(function(){
        this.remove();
    },this);
  },
});

phina.define("HitArea", {
  superClass: 'RectangleShape',
  init: function(x, y, width, height) {
    this.superInit({
      width: width,
      height: height,
      x: x,
      y: y,
      fill: "transparent",
      stroke: "transparent",
    });
    if(DEBUG_MODE) this.stroke = 'red';
    
    this.isActive = true;
    this.tweener.wait(200).call(function(){
        this.isActive = false;
    },this);
  },
  update: function(){
	EnemyGroup.children.each(function(enemy) {
	  if (this.isActive && this.hitTestElement(enemy)){
		  var effect = HitEffect(this.x, this.y + 50, 2).addChildTo(this.parent);
		  enemy.physical.force(30, -30);
		  enemy.tweener
		  .by({
			  rotation:720,
		  },1000,'easeOutCirc')
		  .call(function(){
			  EnemyGroup.children.erase(enemy);
			  effect.remove();
		  });
	  }
	},this);
    
	if(this.hitTestElement(player)){
		player.physical.force(5, -20);
		player.physical.gravity.set(0, 0.98);
	}
	if(! this.isActive) this.remove();
  }
});

phina.define("HitEffect", {
    superClass: "DisplayElement",
    init: function(X,Y,scale) {
      this.superInit({
        x: X,
        y: Y,
        width: 550,
        height: 550,
        fill: "green",
        stroke: null,
      });

      var shape = CircleShape({
        fill: 'rgba(0,0,0,0)',
        stroke: 'white',
        strokeWidth: 2 * scale,
        radius: 180
      }).addChildTo(this);

      shape.tweener
      .clear()
      .to({
        alpha:0,
        scaleX:scale,
        scaleY:scale
      }, 500,"easeOutCubic")
      .to({alpha:0}, 200,"easeOutQuint")
      .call(function(){
        shape.remove();
      });

      var star = StarShape({
        stroke: 'red',
        fiill: 'yellow',
        sides: 11,
        sideIndent: 0.6,
        strokeWidth: 11,
        radius: 90
      }).addChildTo(this);

      star.tweener
      .clear()
      .to({
        alpha:0,
        scaleX:scale,
        scaleY:scale
      }, 300)
      .call(function(){
        star.remove();
      });
}});
