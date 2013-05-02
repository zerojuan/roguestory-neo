(function(module){
	var ValueMap = require('./valuemap');

	var _capWidth = function(startX, width, map){
		var difference = startX+width - map[0].length;
		if(difference >= 0){
			return width - difference;
		}
		return width;
	}

	var _capHeight = function(startY, height, map){
		var difference = startY + height - (map.length-1);
		if(difference >= 0){
			return height - difference;
		}
		return height;
	}

	var _makeRoom = function(x, y, width, height, map, rooms){
		var w = _capWidth(x, width, map);
		var h = _capHeight(y, height, map);

		//select random type of room design
		var room = _designSquareRoom(x,y,w,h,map,rooms);
		if(room){
			console.log('Room: ', room.x+room.width, room.y+room.height);
		}
		return room;
	}

	var _designEntrance = function(startX, startY, width, height, map){
		var w = _capWidth(startX, width, map);
		var h = _capHeight(startY, height, map);

		if(w > 2 && h > 2){
			for(var col = startX; col < startX+w; col++){
				for(var row = startY; row < startY+h; row++){
					val = {
						val: ValueMap["wall"]
					}
					map[row][col] = val;
				}
			}
		}

		return {type: 'entrance', x: startX, y:startY, width: w, height: h, entrance: {
			x: startX+(width/2),
			y: startY
		}};
	}

	var _designSquareRoom = function(startX, startY, width, height, map, rooms){
		
		//iterate through each room, check if it overlaps
		var overlap = false;
		rooms.forEach(function(room){
			if (room.x < startX+width && room.x+room.width > startX &&
    			room.y < startY+height && room.y+room.height > startY){
				overlap = true;
			}			
		});

		if(overlap){
			return null;
		}

		for(var col = startX; col < startX+width; col++){
			for(var row = startY; row < startY+height; row++){
				var val = {};

				if(col == startX || col == startX+width-1){
					val = {
						val : ValueMap['wall'],						
					}
				}else if(row == startY || row==startY+height-1){
					val = {
						val : ValueMap['wall'],						
					}
				}else{
					val = {
						val : '.',									
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

			//decide on how many features this dungeon will have
			var roomsNum = 20;
			var hallwaysNum = 20;
			var i = 0;

			//create entrance
			var entrance = _designEntrance(10, 10, 10, 10, map);
			dungeonData.rooms.push(entrance);
			
			//make about 20 rooms
			for(i = 1; i < roomsNum; i++){

				
				var room = _makeRoom(Math.round(Math.random() * cols) , Math.round(Math.random() * rows), 
					Math.round(Math.random() * 20 + 3), Math.round(Math.random() * 20 + 3), map, dungeonData.rooms);
				if(room){
					dungeonData.rooms.push(room);
				}				
			}

			//make hallways
			for(i = 0; i < hallwaysNum; i++){
				//TODO: Make hallways
			}
			
			return dungeonData;
		}		
	}

}(typeof module === 'undefined' ? this.rogueEngine = {} : module));