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
	tmx: {
		"map": "asset/test.tmx",
	}
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

var map;
var player;
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
	map = Map(AssetManager.get("tmx", "map")).addChildTo(this);

	WalkEnemy().addChildTo(EnemyGroup);
    FlyEnemy().addChildTo(EnemyGroup);
    EnemyGroup.addChildTo(this);
    
    Player().addChildTo(this);
    hammer = Hammer().addChildTo(this);
  },
  onpointstart: function(e) {
    hammer.attack();
  },
  update: function(app){
	// マップとの衝突
	this.mapCollision();
	   
	// ハンマー表示
	this.displayHammer(app);
    
	// ゲームオーバー
	this.gameOver();
	
	// 敵出現
	this.enemyPop(app);
  },
  displayHammer: function(app){
    // ゲーム画面上にマウスカーソルがあれば、ハンマーを表示する。
    hammer.alpha = (app.pointers <= 0) ? 0 : 1;

    // マウスカーソルの位置にハンマーを移動
    app.pointers.forEach(function(p){
      hammer.setPosition(p.x-100, p.y);
    });
  },
  enemyPop: function(app){
    if(app.frame % 80 == 1) WalkEnemy().addChildTo(EnemyGroup);
    if(app.frame % 80 == 3) FlyEnemy().addChildTo(EnemyGroup);
  },
  mapCollision: function(){
	// プレイヤーとマップの衝突処理
	  map.play("background", player);
	
	// 敵全てとマップの衝突処理
	EnemyGroup.children.each(function(enemy) {
		map.play("background", enemy);
	}, this);
  },
  gameOver: function(){
	  EnemyGroup.children.each(function(enemy) {
		  if (player.hitTestElement(enemy)) this.exit();
	  },this);
  }
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
