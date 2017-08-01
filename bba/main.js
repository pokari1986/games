phina.globalize();

var HOST = 'https://pokari1986.github.io/games/';
var ASSETS = {
  image: {
    'hiyoko': 'https://rawgit.com/minimo/phina.js_advent_20151212/master/hiyoco_nomal_full.png',
    'bba': HOST + 'image/bba.png',
    'hammer': HOST + 'image/hammer.png',
  },
  spritesheet: {
    'hiyoko_ss': HOST + 'ss/hiyoko_short.ss',
    'bba_ss': HOST + 'ss/bba_short.ss',
  },
  sound: {
    'se1': HOST + 'sound/SE/boko.mp3',
  },
};

var SCREEN_WIDTH = 1600;
var SCREEN_HEIGHT = 900;
var GROUND_HEIGHT = 100;
var PLAYER_WIDTH = 80;
var PLAYER_HEIGHT = 80;
var SCROLL_SPEED = 5;
var player;
var enemies = [];
var ground;
var hammer;

phina.define('MainScene', {
  superClass: 'CanvasScene',
  
  init: function(options) {
    this.superInit(options);
    
    this.backgroundColor = 'skyblue';

    Player().addChildTo(this);
    Enemy().addChildTo(this);
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
    if(app.frame % 40 == 1) Enemy().addChildTo(this);
  },
  gameOver: function(){
    enemies.each(function(enemy) {
      if (player.hitTestElement(enemy)) this.exit();
    },this);
  },
});

phina.define("Player", {
  superClass: 'Sprite',
  init: function() {
    this.superInit('hiyoko', PLAYER_WIDTH, PLAYER_HEIGHT);
    
    this.scaleX *= -1;
    this.setPosition(300, SCREEN_HEIGHT - GROUND_HEIGHT - PLAYER_HEIGHT/2);
    this.physical.gravity.set(0, 0.98);
    
    var ss = FrameAnimation('hiyoko_ss');
    ss.fit = false;
    ss.attachTo(this);
    ss.gotoAndPlay('start');
    
    player = this;
  }
});

phina.define("Enemy", {
  // Spriteクラスを継承
  superClass: 'Sprite',
  // コンストラクタ
  init: function() {
    // 親クラス初期化
    this.superInit('bba', PLAYER_WIDTH, PLAYER_HEIGHT);
    
    this.setPosition(SCREEN_WIDTH, SCREEN_HEIGHT - GROUND_HEIGHT - PLAYER_HEIGHT/2);
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
  init: function() {
    // 親クラス初期化
    this.superInit({
      width: SCREEN_WIDTH,
      height: GROUND_HEIGHT,
      fill: "brown",
    });
    
    this.origin.set(0,0);
    this.setPosition(0, SCREEN_HEIGHT - GROUND_HEIGHT);
    
    ground = this;
  },
  update: function(){
    if (this.hitTestElement(player)){
      player.physical.gravity.set(0, 0);
      player.bottom = this.top + 10;
    }
    enemies.each(function(enemy) {
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
      width: 80,
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
    enemies.each(function(enemy) {
      if (this.isActive && this.hitTestElement(enemy)){
        var effect = HitEffect(this.x, this.y + 50, 2).addChildTo(this.parent);
        enemy.physical.force(30, -30);
        enemy.tweener
        .by({
          rotation:720,
        },1000,'easeOutCirc')
        .call(function(){
          enemy.remove();
          effect.remove();
        });
        enemies.erase(enemy);
      }
    },this);
    
    if(! this.isActive) this.remove();
  }
});

phina.define("HitEffect", {
    superClass: "CanvasElement",
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
