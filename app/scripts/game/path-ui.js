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
					console.log("I AM INITIALIZING MY PATHS");
					//create a few tiles
					var that = this;

					this.tiles = [];
					for(var i = 0; i < 120; i++){
						var tile = {
							row: 0,
							col: 0,
							graphics: null,
							visible: false,
							setPosition: function(row, col){
								this.row = row;
								this.col = col;

								this.graphics.x = this.col * that.tileSize.x + that.tileSize.x;
								this.graphics.y = this.row * that.tileSize.y;
								this.graphics.alpha = .3;
								createjs.Tween.get(this.graphics, {override: true}).to({alpha:.3}, 300);
							},
							hide: function(){
								createjs.Tween.get(this.graphics, {override: true}).to({alpha:0}, 300);
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
					//console.log('Rendering first element: ', pathList[0]);
					console.log(pathList);
					for(var i = 0; i < this.tiles.length; i++){
						if(pathList && pathList[i]){
							this.tiles[i].setPosition(pathList[i].row, pathList[i].col);
						}else{
							this.tiles[i].hide();
						}

					}
				},
				deactivate: function(){

				}
			}

			return PathUI;
		}]);
}())