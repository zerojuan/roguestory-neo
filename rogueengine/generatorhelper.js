(function(module){
	'use strict';
	var ValueMap = require('./valuemap');

	module.exports = {
		/**
		* Make sure the startX+width does not go off range from the map
		*/
		capWidth : function(startX, width, map){
			var difference = startX+width - (map[0].length - 1);
			if(difference >= 0){
				return width - difference;
			}
			return width;
		},
		/**
		* Make sure the startY+height does not go off range from the map
		*/
		capHeight: function(startY, height, map){
			var difference = startY + height - (map.length-1);
			if(difference >= 0){
				return height - difference;
			}
			return height;
		},
		makeRoom: function(x, y, width, height, map, rooms){
			var w = this.capWidth(x, width, map);
			var h = this.capHeight(y, height, map);

			//select random type of room design
			var room = this.designSquareRoom(x,y,w,h,map,rooms);			
			return room;
		},
		designEntrance: function(startX, startY, width, height, map, direction){
			var w = this.capWidth(startX, width, map);
			var h = this.capHeight(startY, height, map);			
			var d = direction ? direction : 'E';

			if(w < 3 || h < 3){
				return null;
			}
			
			for(var col = startX; col < startX+w; col++){
				for(var row = startY; row < startY+h; row++){
					var val = {
						val: ValueMap["wall"]
					}
					map[row][col] = val;
				}
			}

			var entrance = null;
			switch(d){
				case 'E': entrance = {
						x: startX+w-1,
						y: Math.floor(startY+(h/2))
					};
					break;
				case 'W': entrance = {
						x: startX,
						y: Math.floor(startY+(h/2))
					};
					break;
				case 'N': entrance = {
						x: Math.floor(startX+(w/2)),
						y: startY
					};
					break;
				case 'S': entrance = {
						x: Math.floor(startX+(w/2)),
						y: startY+h-1
					}	
			}

			return {type: 'entrance', x: startX, y:startY, width: w, height: h, entrance: entrance};
		},
		designSquareRoom: function(startX, startY, width, height, map, rooms){
			
			//iterate through each room, check if it overlaps
			var overlap = false;
			if(rooms){
				rooms.forEach(function(room){
					if (room.x < startX+width && room.x+room.width > startX &&
		    			room.y < startY+height && room.y+room.height > startY){
						overlap = true;
					}			
				});
			}			

			if(overlap){
				return null;
			}

			if(width < 3 || height < 3){
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
		},
		designCrossRoom: function(startX, startY, width, height, map){

		},	
		designHallway: function(roomA, roomB, map){

		},
		getPossibleDoorway: function(room){
			//look for doorway per type of room
		},
		getRandomRoom: function(rooms){
			var i = Math.floor(Math.random() * rooms.length);
			return rooms[i];
		}
	}
}(typeof module === 'undefined' ? this.rogueEngine = {} : module));