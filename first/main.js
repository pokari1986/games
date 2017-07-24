// グローバルに展開
phina.globalize();
// アセット
var ASSETS = {
  // 画像
  image: {
    // 地面
    'ground': 'https://rawgit.com/alkn203/tomapiko_void/master/assets/image/ground.png',
    // プレイヤー
    'tomapiko': 'https://rawgit.com/phi-jp/phina.js/develop/assets/images/tomapiko_ss.png',
    // 敵
    'karasu': 'https://rawgit.com/phi-jp/phina.js/develop/assets/images/karasu_ss.png',
  },
  // フレームアニメーション情報
  spritesheet: {
    'tomapiko_ss': 'https://rawgit.com/phi-jp/phina.js/develop/assets/tmss/tomapiko.tmss',
    'karasu_ss': 'https://rawgit.com/phi-jp/phina.js/develop/assets/tmss/karasu.tmss',
  },
};
// 定数
var SCREEN_WIDTH   = 640; // 画面横サイズ
var SCREEN_HEIGHT  = 640; // 画面縦サイズ
var GROUND_HEIGHT  = 64;  // 地面の縦サイズ
var PLAYER_SIZE    = 64;  // プレイヤーのサイズ
var PLAYER_SPEED   = 6;   // プレイヤーの速度
var ENEMY_SIZE     = 64;  // 敵のサイズ
var ENEMY_SPEED    = 2;   // 敵の横方向の速さ
var ENEMY_MAX_NUM  = 6;   // 敵生成の最大数
var ENEMY_INTERVAL = 300; // 敵を生成する間隔
var GRAVITY        = 0.2; // 重力
var HIT_RADIUS     = 16;  // 当たり判定用の半径
/*
 * メインシーン
 */
phina.define("MainScene", {
  // 継承
  superClass: 'DisplayScene',
  // コンストラクタ
  init: function() {
    // 親クラス初期化
    this.superInit({
      // 画面サイズ指定
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT,
    });
    // 背景色
    this.backgroundColor = 'skyblue';
    // カスタムGrid
    var grid = Grid(SCREEN_WIDTH, 10);
    // thisを退避
    var self = this;
    // 繰り返し
    (10).times(function(i) {
      // 地面配置
      Ground().addChildTo(self).setPosition(grid.span(i), grid.span(9));
    });
    // プレイヤー作成
    this.player = Player().addChildTo(this)
                          .setPosition(grid.span(0.5), grid.span(8.5));
    // 敵グループ
    this.enemyGroup = DisplayElement().addChildTo(this);
    // 最初の敵生成
    this.generateEnemy();
  },
  // 更新処理
  update: function(app) {
    var enemys = this.enemyGroup.children;
    // 一定フレーム経過したら
    if (app.frame % ENEMY_INTERVAL === 0 && enemys.length < ENEMY_MAX_NUM) {
      // 敵生成
      this.generateEnemy();
    }

    // 敵とプレイヤーの辺り判定
    this.hitTestEnemyPlayer();
  },
  // タッチ時処理
  onpointstart: function() {
    // プレイヤー移動反転
    this.player.reflectX();
  },
  // 敵とプレイヤーの当たり判定処理
  hitTestEnemyPlayer: function() {
    var player = this.player;
    var self = this;

    // 敵をループ
    this.enemyGroup.children.each(function(enemy) {
      // 判定用の円
      var c1 = Circle(player.x, player.y, HIT_RADIUS);
      var c2 = Circle(enemy.x, enemy.y, enemy.x/4);
      // 円判定
      if (Collision.testCircleCircle(c1, c2)) {
    	  enemy.scaleX += 0.1;
    	  enemy.scaleY += 0.1;
      }
    });
  },
  // 敵生成処理
  generateEnemy: function() {
    // 位置決めにランダム値を利用
    var x = this.gridX.span(Random.randint(2, 14));
    var y = this.gridY.span(Random.randint(2, 3));
    // グループに追加
    Enemy().addChildTo(this.enemyGroup).setPosition(x, y);
  },
});
/*
 * 地面クラス
 */
phina.define("Ground", {
  // 継承
  superClass: 'Sprite',
  // コンストラクタ
  init: function() {
    // 親クラス初期化
    this.superInit('ground');
    // 原点を左上に
    this.origin.set(0, 0);
  },
});
/*
 * プレイヤークラス
 */
phina.define("Player", {
  // 継承
  superClass: 'Sprite',
  // コンストラクタ
  init: function() {
    // 親クラス初期化
    this.superInit('tomapiko', PLAYER_SIZE, PLAYER_SIZE);
    // スプライトにフレームアニメーションをアタッチ
    FrameAnimation('tomapiko_ss').attachTo(this).gotoAndPlay('right');
    // 移動
    this.physical.velocity.x = PLAYER_SPEED;
  },
  // 更新処理
  update: function() {
    // 画面左
    if (this.left < 0) {
      // 位置補正
      this.left = 0;
      // 反転処理
      this.reflectX();
    }
    // 画面右
    if (this.right > SCREEN_WIDTH) {
      this.right = SCREEN_WIDTH;
      this.reflectX();
    }
  },
  // 反転処理
  reflectX: function() {
    // 移動方向反転
    this.physical.velocity.x *= -1;
    // 向き反転
    this.scaleX *= -1;
  },
});
/*
 * 敵クラス
 */
phina.define("Enemy", {
  // 継承
  superClass: 'Sprite',
  // コンストラクタ
  init: function() {
    // 親クラス初期化
    this.superInit('karasu', ENEMY_SIZE, ENEMY_SIZE);
    // スプライトにフレームアニメーションをアタッチ
    FrameAnimation('karasu_ss').attachTo(this).gotoAndPlay('fly');
    // 移動方向をランダムに決める
    var dir = [1, -1].random();
    // 画像向き補正
    if (dir > 0) this.scaleX *= -1;
    // 横移動
    this.physical.velocity.x = dir * ENEMY_SPEED;
    // 重力
    this.physical.gravity.y = GRAVITY;
  },
  // 更新処理
  update: function() {
    // 画面左
    if (this.left < 0) {
      // 位置補正
      this.left = 0;
      // 移動方向反転
      this.reflectX();
    }
    // 画面右
    if (this.right > SCREEN_WIDTH) {
      this.right = SCREEN_WIDTH;
      this.reflectX();
    }
    // 地面ライン
    var y = SCREEN_HEIGHT - GROUND_HEIGHT;
    // 地面
    if (this.bottom > y) {
      // 反射
      this.bottom = y;
      this.physical.velocity.y *= -1;
    }
  },
  // 反転処理
  reflectX: function() {
    // 移動方向反転
    this.physical.velocity.x *= -1;
    // 向き反転
    this.scaleX *= -1;
  },
});
/*
 * メイン処理
 */
phina.main(function() {
  // アプリケーションを生成
  var app = GameApp({
    // メインシーンから開始
    startLabel: 'main',
    // 画面サイズ指定
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    // アセット読み込み
    assets: ASSETS,
  });
  // 実行
  app.run();
});