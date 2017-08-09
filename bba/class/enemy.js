phina.define("Enemy", {
	superClass: 'RectangleShape',
	init: function(options) {
		this.superInit({
	    	width: TILE_SIZE,
	    	height: TILE_SIZE,
	    	fill: 'transparent',
	    	x: options["x"],
	    	y: options["y"],
	    	originX: 0,
	    	originY: 0
		});
		
	    if(DEBUG_MODE) {
	    	this.stroke = 'red';
	    	this.padding = 0;
	    }
	    
		// デフォルトの重力
		this.physical.gravity.set(0, 0.98);
		
		this.enemy = Sprite(options["type"], TILE_SIZE, TILE_SIZE).addChildTo(this);
		this.enemy.origin.set(0,0);
	},
	update: function(){
		// デフォルトは左に向かって歩くだけ
		this.simple_walk("left", 5);
	},
	simple_walk: function(direction, speed){
		// 左に向かって歩くだけ
		if(direction == "right") this.x += speed;
		// 右に向かって歩くだけ
		if(direction == "left")  this.x -= speed;
	},
	set_animation: function(key, label){
	    var ss = FrameAnimation(key);
	    ss.fit = false;
	    ss.attachTo(this.enemy);
	    ss.gotoAndPlay(label);
	}
});

phina.define("WalkEnemy", {
	superClass: 'Enemy',
	init: function() {
		this.superInit({
			type: "bba",
			x: MainGridX.span(TILE_COL_NUM),
			y: MainGridY.span(TILE_ROW_NUM - 3),
		});
	    
		// アニメーションを指定
		this.set_animation("bba_ss", "start");
	  },
	});

phina.define("FlyEnemy", {
	superClass: 'Enemy',
	init: function() {
		this.superInit({
			type: "bba",
	    	x: MainGridX.span(TILE_COL_NUM),
	    	y: MainGridY.span(3),
		});
		
		// 重力を指定
		this.physical.gravity.set(0, 0.04);
	    
		// アニメーションを指定
	    this.set_animation("bba_ss", "start");
	},
});
