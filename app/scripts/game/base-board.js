(function(){
	'use strict';

	function _getColorFromMaterial(material, strength){
		switch(material){			
			case 'STONE':	if(strength){
								var s = 1.3 - (strength);
								return 'rgba(195,227,179,'+s+')';	
							}return 'rgba(195,227,179,1)';
			case 'EARTH': return 'rgba(233,233,176,1)';
			case 'HERO_NORMAL': return 'rgba(200,200,170,1)';
		}
	}
	
	angular.module('myApp.gameModule')
		.factory('BaseBoard', [function() {
			var BaseBoard = function(opts){
				this.initialize(opts);
			}

			var p = BaseBoard.prototype = new createjs.DisplayObject();

			p.DisplayObject_initialize = p.initialize;

			p.initialize = function(opts){
				console.log("Initializing...");
				this.DisplayObject_initialize();
				this.tileWidth = 13;
				this.tileHeight = 19;
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
							}else if(val.object){ //if this tile has an object on top, render that object
								val = val.object;
							}

							var t = val.tint;
							ctx.font = '13pt Conv_roguestoryneo';
							var fillStyle = _getColorFromMaterial(val.material, val.strength);
							//console.log(fillStyle);
							ctx.fillStyle = fillStyle;
							//ctx.fillRect(y * this.tileWidth, x * this.tileHeight, this.tileWidth, this.tileHeight);

							if(val.visibility == 1){
								if(val.pulse){
									ctx.globalAlpha = val.pulse;//val.pulse;
								}else{
									ctx.globalAlpha = val.visibility;
								}
							}else{
								ctx.globalAlpha = val.visibility;
							}




							
							//ctx.fillStyle = 'rgba('+t.r+','+t.g+','+t .b+',1)';
							//ctx.globalCompositeOperation = 'destination-atop';							
							//ctx.drawImage(img, val.val * this.tileWidth, 0, this.tileWidth, this.tileHeight, 
							//	y * this.tileWidth, x * this.tileHeight, this.tileWidth, this.tileHeight );						
							if(val.val == 'E' && this.map[x+1][y].val == 'E'){
								ctx.fillText('H', y * this.tileWidth, x * this.tileHeight); //horizontal walls
							}else{
								ctx.fillText(val.val, y * this.tileWidth, x * this.tileHeight);
							}
							
							val.pulse += 0.1;
							if(val.pulse > 1.0){
								val.pulse = 0;
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