(function(){
	'use strict';

	angular.module('myApp.gameModule')
		.factory('PathUI', function(){
			var PathUI = function(opts){
				this.graphics = new createjs.Container();				
				this.initialize(opts);	
			}

			PathUI.prototype = {
				tiles: [],
				possibles: [],
				initialize: function(opts){
					//create a few tiles
					for(var i = 0; i < 32; i++){
						var tile = {
							row: 0,
							col: 0,
							graphics: null,
							visible: false,
							setPosition: function(row, col){
								this.row = row;
								this.col = col;
							}
						};

						var graphics = new createjs.Graphics();
						graphics.beginFill('#0c0');
						graphics.drawRect(0, 0, 16, 16);
						graphics.endFill();

						tile.graphics = new createjs.Shape(graphics);
						tile.graphics.x = i * 5;
						tile.graphics.alpha = 0;
						this.tiles.push(tile);
						this.graphics.addChild(tile.graphics);
					}
				},
				activate: function(){

				},
				deactivate: function(){

				}
			}

			return PathUI;
		});
}())