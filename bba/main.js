/*
 * runstant
 */

phina.globalize();

var HOST = 'https://pokari1986.github.io/games/';
var ASSETS = {
  image: {
    'hiyoko': 'https://rawgit.com/minimo/phina.js_advent_20151212/master/hiyoco_nomal_full.png',
    'bba': HOST + 'image/bba.png',
  },
  spritesheet: {
    'hiyoko_ss': HOST + 'ss/hiyoko_short.ss',
    'bba_ss': HOST + 'ss/bba_short.ss',
  },
  sound: {
    'se1': HOST + 'sound/SE/boko.mp3',
  },
};
https://rawgit.com/minimo/phina.js_advent_20151212/master/hiyoko_short.ss

var SCREEN_WIDTH = 1200;
var SCREEN_HEIGHT = 800;
var GROUND_HEIGHT = 100;
var PLAYER_WIDTH = 80;
var PLAYER_HEIGHT = 80;
var SCROLL_SPEED = 5;

var player;
var enemies = [];

phina.define('MainScene', {
  superClass: 'CanvasScene',
  
  init: function(options) {
    this.superInit(options);
    this.backgroundColor = 'skyblue';
    this.ground = Ground(this).addChildTo(this);
    this.player = Player(this).addChildTo(this);
    this.enemy = Enemy(this).addChildTo(this);

  },
  onpointstart: function(e) {
    var hammer = Hammer(this, e.pointer.x - 50, e.pointer.y).addChildTo(this);
  },
  update: function(app){
    if(app.frame % 40 == 1){
      this.enemy = Enemy(this).addChildTo(this);
    }
    var copied = enemies.clone();
    copied.each(function(i) {
      var enemy = i;
      if (this.player.hitTestElement(enemy)){
        this.exit();
      }
    },this);
  },
});

phina.define("Player", {
  // Spriteクラスを継承
  superClass: 'Sprite',
  // コンストラクタ
  init: function(screen) {
    // 親クラス初期化
    this.superInit('hiyoko');
    
    this.origin.set(0,0);
        
    this.width = PLAYER_WIDTH;
    this.height = PLAYER_HEIGHT;
    this.scaleX *= -1;
    this.setPosition(screen.gridX.span(4), SCREEN_HEIGHT - GROUND_HEIGHT - PLAYER_HEIGHT+10);
    this.physical.gravity.set(0, 0.98);
    var ss = FrameAnimation('hiyoko_ss');
    ss.fit = false;
    ss.attachTo(this);
    ss.gotoAndPlay('start');
    player = this;
  },
});

phina.define("Enemy", {
  // Spriteクラスを継承
  superClass: 'Sprite',
  // コンストラクタ
  init: function(screen) {
    // 親クラス初期化
    this.superInit('bba');
    
    this.origin.set(0,0);
    this.width = PLAYER_WIDTH;
    this.height = PLAYER_HEIGHT;
    this.setPosition(SCREEN_WIDTH, SCREEN_HEIGHT - GROUND_HEIGHT - PLAYER_HEIGHT + 10);
    this.physical.gravity.set(0, 0.98);
    var ss = FrameAnimation('bba_ss');
    ss.fit = false;
    ss.attachTo(this);
    ss.gotoAndPlay('start');
    enemies.push(this);
  },
  update: function(){
    this.x -= SCROLL_SPEED;
  }
});

phina.define("Ground", {
  // Spriteクラスを継承
  superClass: 'RectangleShape',
  // コンストラクタ
  init: function(screen) {
    // 親クラス初期化
    this.superInit();
    
    this.origin.set(0,0);
    this.width = SCREEN_WIDTH;
    this.height = GROUND_HEIGHT;
    this.fill = "brown"
    this.setPosition(0, SCREEN_HEIGHT - GROUND_HEIGHT);
  },
  update: function(){
    if (this.hitTestElement(player)){
      player.physical.gravity.set(0, 0);
      player.bottom = this.top + 10;
    }
    var copied = enemies.clone();
    copied.each(function(i) {
      var enemy = i;
      if (this.hitTestElement(enemy)){
        enemy.physical.gravity.set(0, 0);
        enemy.bottom = this.top + 10;
      }
    }, this);
  },
});

phina.define("Hammer", {
  superClass: 'CanvasElement',
  init: function(screen, x, y) {
    this.superInit({x:x,y:y});

    var handle = RectangleShape({
      width:30,
      height:260,
      fill:"brown",
      stroke:"black",
      strokeWidth:10,
    }).addChildTo(this);
    var head = RectangleShape({
      y:-80,
      width:150,
      height:60,
      fill:"silver",
      stroke:"black",
      strokeWidth:10,
    }).addChildTo(this);
    
    var hit_area = HitArea(x + 80, y).addChildTo(screen);

    // 追加したハンマーにアニメーションをつける
    this.tweener.rotateBy(90, 100).call(function(){
      SoundManager.play('se1');
      }).to({alpha:0}, 400, 'easing').call(function(){
        this.remove();
    },this);
  },
});

phina.define("HitArea", {
  superClass: 'RectangleShape',
  init: function(x, y) {
    this.superInit();
    
    this.origin.set(0,0);
    this.width = 80;
    this.height = 150;
    this.fill = "transparent";
    this.stroke = "transparent";
    this.strokeWidth = 0;
    this.setPosition(x, y);
    
    this.tweener.wait(200).call(function(){
        this.remove();
    },this);
  },
    update: function(){
    var copied = enemies.clone();
    copied.each(function(i) {
      var enemy = i;
      if (this.hitTestElement(enemy)){
        var effect = HitEffect(this.x, this.y + 50, 2).addChildTo(this.parent);
        enemy.physical.force(30, -30);
        enemy.tweener.by({
          rotation:720,
        },1000,'easeOutCirc').call(function(){
          enemy.remove();
          effect.remove();
        });
        enemies.erase(enemy);
      }
    },this);
  }
});

phina.define("HitEffect", {
    superClass: "CanvasElement",
    init: function(X,Y,scale) {
      this.superInit({
        x:X,
        y:Y,
        width: 550,
        height: 550,
        fill: "green",
        stroke: null,
      });

      var shape = CircleShape().addChildTo(this);
      // 位置を指定
      shape.fill = 'rgba(0,0,0,0)';
      shape.stroke = 'white';
      shape.strokeWidth = 2 * scale;
      shape.radius  = 180;
      shape.tweener
      .clear()
      .to({alpha:0,scaleX:scale,scaleY:scale}, 500,"easeOutCubic")
      .to({alpha:0}, 200,"easeOutQuint")
      .call(function(){
        shape.remove();
      });

      // 図形をシーンに追加
      var star = StarShape().addChildTo(this);
      // 位置を指定
      star.stroke = 'red';
      star.fill = 'yellow';
      star.sides = 11;
      star.sideIndent = 0.6;
      star.strokeWidth = 11;
      star.radius  = 90;
      star.tweener
      .clear()
      .to({alpha:0,scaleX:scale,scaleY:scale}, 300)
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
  
  app.run();
});
