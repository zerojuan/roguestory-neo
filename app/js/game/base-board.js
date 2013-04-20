(function(){
	'use strict';
	
	angular.module('myApp.gameModule', [])
		.factory('BaseBoard', [function() {
			var BaseBoard = function(opts){
				this.initialize(opts);
			}

			var p = BaseBoard.prototype = new createjs.DisplayObject();

			p.DisplayObject_initialize = p.initialize;

			p.initialize = function(opts){
				console.log("Initializing...");
				this.DisplayObject_initialize();
				this.tileWidth = 12;
				this.tileHeight = 18;
				if(opts.tileSheet){
					this.tileSheet = opts.tileSheet;
				}
				this.map = opts.map;
			}

			p.DisplayObject_draw = p.draw;

			p.draw = function(ctx, ignoreCache){
				var img = this.tileSheet;
				var ga = 0;
				for(var x = 0; x < this.map.length; x++){
						for(var y = 0; y < this.map[x].length; y++){							
							var val = this.map[x][y];
							if(val.val == '0'){
								continue;
							}
							var t = val.tint;
							ctx.font = '13pt Conv_roguestoryneo';
							ctx.fillStyle = 'rgba('+t.r+','+t.g+','+t.b+',1)';
							//ctx.fillRect(y * this.tileWidth, x * this.tileHeight, this.tileWidth, this.tileHeight);
							if(val.val != 'E' && val.val != '#'){
								ctx.globalAlpha = val.ga;	
							}else{
								ctx.globalAlpha = 1;
							}
							
							//ctx.fillStyle = 'rgba('+t.r+','+t.g+','+t .b+',1)';
							//ctx.globalCompositeOperation = 'destination-atop';							
							//ctx.drawImage(img, val.val * this.tileWidth, 0, this.tileWidth, this.tileHeight, 
							//	y * this.tileWidth, x * this.tileHeight, this.tileWidth, this.tileHeight );						
							if(val.val == 'E' && this.map[x+1][y].val == 'E'){
								ctx.fillText('H', y * this.tileWidth, x * this.tileHeight);
							}else{
								ctx.fillText(val.val, y * this.tileWidth, x * this.tileHeight);
							}
							
							val.ga += 0.1;
							if(val.ga > 1.0){
								val.ga = 0;
							}
						}
				}

				return true;
			}

			p.updateMap = function(map){
				this.map = map;
			}

		    return BaseBoard;
		}]);		
}());