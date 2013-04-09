(function(){
	'use strict';
	
	angular.module('myApp.gameModule', [])
		.factory('BaseBoard', ['$rootScope','httpBuffer', function($rootScope, httpBuffer) {
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
				this.map = [];
				var rows = 38;
				var cols = 72;
				for(var y = 0; y < rows; y++){
					this.map[y] = [];
					for(var x = 0; x < cols; x++){
						this.map[y][x] = Math.round(Math.random() * 30);
					}
				}
			}

			p.DisplayObject_draw = p.draw;

			p.draw = function(ctx, ignoreCache){
				var img = this.tileSheet;
				var ga = 0;
				for(var x = 0; x < this.map.length; x++){
						for(var y = 0; y < this.map[x].length; y++){
							ctx.globalAlpha = ga;
							ctx.drawImage(img, this.map[x][y] * this.tileWidth, 0, this.tileWidth, this.tileHeight, 
								y * this.tileWidth, x * this.tileHeight, this.tileWidth, this.tileHeight );						
							ga += 0.1;
							if(ga > 1.0){
								ga = 0;
							}
						}
				}

				return true;
			}

		    return BaseBoard;
		}]);		
}());