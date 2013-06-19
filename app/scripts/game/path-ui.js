(function(){
	'use strict';

	angular.module('myApp.gameModule')
		.factory('PathUI', ['AppRegistry', function(AppRegistry){
			var PathUI = function(opts){
				this.graphics = new createjs.Container();				
				this.initialize(opts);	
			}

			PathUI.prototype = {
				tiles: [],
				possibles: [],
				initialize: function(opts){
					//create a few tiles
					var that = this;
					for(var i = 0; i < 32; i++){
						var tile = {
							row: 0,
							col: 0,
							graphics: null,
							visible: false,
							setPosition: function(row, col){
								this.row = row;
								this.col = col;

								this.graphics.x = this.col * that.tileSize.x;
								this.graphics.y = this.row * that.tileSize.y;
								this.graphics.alpha = .3;
							}
						};

						var graphics = new createjs.Graphics();
						graphics.beginFill('#0c0');
						if(opts.tileSize){
							this.tileSize = opts.tileSize;
						}else{
							this.tileSize = {x: 16, y:16};
						}
						graphics.drawRect(0, 0, this.tileSize.x, this.tileSize.y);
						graphics.endFill();

						tile.graphics = new createjs.Shape(graphics);
						tile.graphics.x = i * 13;
						tile.graphics.alpha = .1;
						this.tiles.push(tile);
						this.graphics.addChild(tile.graphics);


					}
				},
				activate: function(pathList){
					for(var i = 0; i < pathList.length; i++){
						this.tiles[i].setPosition(pathList[i].row, pathList[i].col);
					}
				},
				deactivate: function(){

				}
			}

			return PathUI;
		}]);
}())