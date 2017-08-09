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
	var tmx = AssetManager.get("tmx", "map");
	Sprite(tmx.image)
    .setOrigin(0, 0)
    .setPosition(0, 0)
    .addChildTo(this.mapBase);
	
    map = tmx.getMapData("background");

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
    
	this.collision(player);
	EnemyGroup.children.each(function(enemy) {
		this.collision(enemy)
	}, this);
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
  collision: function(obj){
	var x = Math.floor(obj.x/TILE_SIZE);
	var y = Math.floor(obj.y/TILE_SIZE);
  
	// 着地
	if (map[(y + 1) * TILE_COL_NUM + x] !== -1) {
		obj.physical.force(0,0);
		obj.y = MainGridY.span(Math.floor(obj.y/TILE_SIZE));
	}
	// 上に天井
	if (map[(y) * TILE_COL_NUM + x] !== -1) {
		obj.physical.force(0,0);
		obj.y = MainGridY.span(Math.ceil(obj.y/TILE_SIZE));
	}
	// 左に壁
	if (map[y * TILE_COL_NUM + x] !== -1) {
		obj.physical.force(0,0);
		obj.x = MainGridX.span(Math.ceil(obj.x/TILE_SIZE));
	}
	// 右に壁
	if (map[y * TILE_COL_NUM + (x + 1)] !== -1) {
		obj.physical.force(0,0);
		obj.x = MainGridX.span(Math.floor(obj.x/TILE_SIZE));
	}
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
