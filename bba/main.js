/*
 * runstant
 */

phina.globalize();

var HOST = 'https://pokari1986.github.io/games/';
var ASSETS = {
  image: {
    'cats': '../image/cats.png',
    'bba': '../image/bba.png',
    'hammer': '../image/hammer.png',
    'grass': '../image/grass.png',
  },
  spritesheet: {
    'cats_ss': HOST + 'ss/cats.ss',
    'bba_ss': HOST + 'ss/bba.ss',
  },
  sound: {
    'se1': HOST + 'sound/SE/boko.mp3',
  },
};


var TILE_COL_NUM = 25;
var TILE_ROW_NUM = 15;
var TILE_SIZE = 64;
var SCREEN_WIDTH = TILE_COL_NUM * TILE_SIZE;
var SCREEN_HEIGHT = TILE_ROW_NUM * TILE_SIZE;

var MainGridX = Grid({
	width: SCREEN_WIDTH,
	columns: TILE_COL_NUM,
});
var MainGridY = Grid({
	width: SCREEN_HEIGHT,
	columns: TILE_ROW_NUM,
});

var GROUND_HEIGHT = TILE_SIZE * 2;
var player;
var ground;
var hammer;

var EnemyGroup = DisplayElement();

phina.define('MainScene', {
  superClass: 'DisplayScene',
  
  init: function(options) {
    this.superInit(options);
    
    this.backgroundColor = 'skyblue';

    WalkEnemy().addChildTo(EnemyGroup);
    FlyEnemy().addChildTo(EnemyGroup);
    EnemyGroup.addChildTo(this);
    
    Player().addChildTo(this);
    Ground().addChildTo(this);
    hammer = Hammer().addChildTo(this);
  },
  onpointstart: function(e) {
    hammer.attack();
  },
  update: function(app){
    this.enemyPop(app);
    this.gameOver();
    
    if(app.pointers <= 0) {
      hammer.alpha = 0;
    }else{
      hammer.alpha = 1;
    }
    app.pointers.forEach(function(p){
      hammer.setPosition(p.x-100, p.y);
    });
  },
  enemyPop: function(app){
    if(app.frame % 80 == 1) WalkEnemy().addChildTo(EnemyGroup);
    if(app.frame % 80 == 3) FlyEnemy().addChildTo(EnemyGroup);
  },
  gameOver: function(){
	  EnemyGroup.children.each(function(enemy) {
		  if (player.hitTestElement(enemy)) this.exit();
	  },this);
  },
});

phina.define("Ground", {
  // Spriteクラスを継承
  superClass: 'RectangleShape',
  // コンストラクタ
  init: function() {
    // 親クラス初期化
    this.superInit({
      width: SCREEN_WIDTH,
      height: GROUND_HEIGHT,
      fill: "brown",
    });
    
    this.origin.set(0,0);
    this.setPosition(MainGridX.span(0), MainGridY.span(TILE_ROW_NUM) - GROUND_HEIGHT);
    
    (TILE_COL_NUM).times(function(i){
        var sprite = Sprite('grass', TILE_SIZE, TILE_SIZE).addChildTo(this);
        sprite.origin.set(0,0);
        sprite.x = i * TILE_SIZE;
        sprite.y = 0;
    }, this);
    ground = this;
  },
  update: function(){
    if (this.hitTestElement(player)){
      player.physical.gravity.set(0, 0);
      player.bottom = this.top + 10;
    }
    EnemyGroup.children.each(function(enemy) {
      if (this.hitTestElement(enemy)){
        enemy.physical.gravity.set(0, 0);
        enemy.bottom = this.top + 10;
      }
    }, this);
  },
});

phina.define("Hammer", {
  superClass: 'Sprite',
  init: function() {
    this.superInit('hammer');
    this.alpha = 0;
    this.scaleX = 0.7;
    this.scaleY = 0.7;
    this.origin.set(0.5, 0.8);
  },
  attack: function(){
    var hit_area = HitArea(this.x + 110, this.y).addChildTo(this.parent);

    this.tweener.rotateTo(120, 100).call(function(){
		hammer = Hammer().addChildTo(this.parent);
		SoundManager.play('se1');
      }, this).to({alpha:0}, 400, 'easing').call(function(){
        this.remove();
    },this);
  }
});

phina.define("HitArea", {
  superClass: 'RectangleShape',
  init: function(x, y) {
    this.superInit({
      width: 120,
      height: 300,
      fill: "transparent",
      stroke: "transparent",
    });
    this.setPosition(x, y);
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

phina.main(function() {
  var app = GameApp({
    startLabel: 'main',
    assets: ASSETS,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT
  });
  app.interactive.cursor.normal = 'none';
  app.interactive.cursor.hover = 'none';
  app.run();
});
