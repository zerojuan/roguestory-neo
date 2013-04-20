(function(module){
	var ValueMap = require('./valuemap');

	var _makeRoom = function(x, y, width, height, map){
		return _designSquareRoom(x,y,width,height,map);
	}

	var _designEntrance = function(startX, startY, width, height, map){

	}

	var _designSquareRoom = function(startX, startY, width, height, map){
		if(map.length-1 < (startY + height)){
			console.log('Map.length: ' + map.length, "  : " + (startY+height));
			return null;
		}
		if(map[0].length-1 < (startX + width) ){
			console.log('Map[0].length: ' + map[0].length, "  : " +  (startX+width));
			return null;
		}
		for(var col = startX; col < startX+width; col++){
			for(var row = startY; row < startY+height; row++){
				var val = {};

				if(col == startX || col == startX+width-1){
					val = {
						val : '#',
						ga : Math.random(),
						tint : {
							r : 255,
							g : 255,
							b : 255,
							t : 0.6
						}
					}
				}else if(row == startY || row==startY+height-1){
					val = {
						val : ValueMap['wall'],
						ga : Math.random(),
						tint : {
							r : 255,
							g : 255,
							b : 255,
							t : 0.6
						}
					}
				}else{
					val = {
						val : '.',
						ga : Math.random(),
						tint : {
							r : 255,
							g : 255,
							b : 255,
							t : 0.6
						}
					}
				}
				map[row][col] = val;				
			}
		}
		return {type : 'square', x: startX, y: startY, width: width, height: height};
	}

	var _designCrossRoom = function(startX, startY, width, height, map){

	}	

	var _designHallway = function(roomA, roomB, map){

	}

	module.exports = {
		generateDungeon : function(size, level){
			var dungeonData = {
				rooms : [],
				width: size.width,
				height: size.height
			};
			var map = [];
			var rows = size.height; //38;
			var cols = size.width; //80;
			for(var y = 0; y < rows; y++){
				map[y] = [];
				for(var x = 0; x < cols; x++){
					var val = 65 + (Math.round((Math.random() * ((70 - 65) + 1))));						
					map[y][x] = {
						val : '0'
					}					
				}
			}

			for(var i = 0; i < 20; i++){
				//make about 20 rooms
				var room = _makeRoom(Math.round(Math.random() * cols) , Math.round(Math.random() * rows), 
					Math.round(Math.random() * 20 + 3), Math.round(Math.random() * 20 + 3), map);
				if(room){
					dungeonData.rooms.push(room);
				}				
			}			
			
			return dungeonData;
		}		
	}

}(typeof module === 'undefined' ? this.rogueEngine = {} : module));