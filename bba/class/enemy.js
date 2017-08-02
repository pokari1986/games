phina.define("Enemy", {
	superClass: 'Sprite',
	init: function(options) {
		this.superInit(options["type"]);
		
		// 配置
		this.x = options["x"];
		this.y = options["y"];
		
		// デフォルトの重力
		this.physical.gravity.set(0, 0.98);
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
	    ss.attachTo(this);
	    ss.gotoAndPlay(label);
	}
});

phina.define("WalkEnemy", {
	superClass: 'Enemy',
	init: function(main) {
		this.superInit({
			type: "bba",
			x: mainGridX.span(50),
			y: mainGridY.span(25),
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
	    	x: mainGridX.span(50),
	    	y: mainGridY.span(2),
		});
		
		// 重力を指定
		this.physical.gravity.set(0, 0.04);
	    
		// アニメーションを指定
	    this.set_animation("bba_ss", "start");
	},
});
