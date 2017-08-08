/*
 * runstant
 */

phina.globalize();

var HOST = 'https://pokari1986.github.io/games/';
var ASSETS = {
	image: {
		'player': 'assets/chara01_a1.png',
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
//	tmx: {
//		"map": "asset/test.tmx",
//	}
};

var DEBUG_MODE = true;

var TILE_COL_NUM = 35;
var TILE_ROW_NUM = 20;
var TILE_SIZE = 32;
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
    this.mapBase = DisplayElement()
    .setPosition(0, 0)
    .addChildTo(this);

  //.tmxファイルからマップをイメージとして取得し、スプライトで表示
//  this.tmx = AssetManager.get("tmx", "map");
//  this.map = Sprite(this.tmx.image)
//    .setOrigin(0, 0)
//    .setPosition(0, 0)
//    .addChildTo(this.mapBase);
//  this.map.tweener.clear().setUpdateType('fps');

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

phina.main(function() {
  var app = GameApp({
    startLabel: 'main',
    assets: ASSETS,
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    fit: false,
  });
  app.interactive.cursor.normal = 'none';
  app.interactive.cursor.hover = 'none';
  app.run();
});
