phina.define("Map", {
	superClass: 'DisplayElement',
	init: function(tmx) {
		this.superInit({
			x: 0,
			y: 0
		});

		this.tmx = tmx;
		
		// マップ画像を取得
		Sprite(tmx.image)
	    .setOrigin(0, 0)
	    .setPosition(0, 0)
	    .addChildTo(this);
	},
	play: function(layer, obj){
		var mapData = this.tmx.getMapData(layer);
		
		var x = Math.floor(obj.x/TILE_SIZE);
		var y = Math.floor(obj.y/TILE_SIZE);
	  
		if (this.judge(mapData, x, y + 1)) 	this.stop(obj, "DOWN");		// 着地
		if (this.judge(mapData, x, y)) 		this.stop(obj, "UP");		// 上に天井
		if (this.judge(mapData, x, y)) 		this.stop(obj, "LEFT");		// 左に壁
		if (this.judge(mapData, x + 1, y)) 	this.stop(obj, "RIGHT");	// 右に壁
	},
	judge: function(mapData, x, y){
		// 指定したマップデータの指定座標にオブジェクトがあれば、衝突すると判断する（=TRUEを返す）。
		return (mapData[y * TILE_COL_NUM + x] !== -1);
	},
	stop: function(obj, dir){	
		// 進行方向ごとに
		switch(dir){
		case "DOWN":
			obj.y = MainGridY.span(Math.floor(obj.y/TILE_SIZE));
			obj.physical.velocity.y = 0;
			break;
		case "UP":
			obj.y = MainGridY.span(Math.ceil(obj.y/TILE_SIZE));
			obj.physical.velocity.y = 0;
			break;
		case "LFET":
			obj.x = MainGridX.span(Math.ceil(obj.x/TILE_SIZE));
			obj.physical.velocity.x = 0;
			break;
		case "RIGHT":
			obj.x = MainGridX.span(Math.floor(obj.x/TILE_SIZE));
			obj.physical.velocity.x = 0;
			break;
		}	
	}
});
