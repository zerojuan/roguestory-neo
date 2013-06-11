(function(module){
	'use strict';
	var ValueMap = require('./valuemap');

	module.exports = {
		/**
		* Get random integer between min and max
		*/
		getRandomInt: function(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},
		/**
		* Check if 2 points are othogonally adjacent
		*/
		isAdjacentOrtho: function(pointA, pointB){
			if(pointA.x+1 == pointB.x && pointA.y == pointB.y){
				return true;
			}else if(pointA.x-1 == pointB.x && pointA.y == pointB.y){
				return true;
			}else if(pointA.y+1 == pointB.y && pointA.x == pointB.x){
				return true;
			}else if(pointA.y-1 == pointB.y && pointA.x == pointB.x){
				return true;
			}
			return false;
		},
		capX : function(x, map){
			var result = x;
			if(x < 0){
				result = 0;
				return result;
			}else if(x > map.width - 1){
				result = map.width - 1;
				return result;
			}
			return result;
		},
		capY : function(y, map){
			var result = y;
			if(y < 0){
				result = 0;
				return result;
			}else if(y > map.height - 1){
				result = map.height - 1;
				return result;
			}
			return result;
		},
		/**
		* Make sure the startX+width does not go off range from the map
		*/
		capWidth : function(startX, width, map, direction){
			var _direction = direction || 'E';
			if(_direction == 'E'){
				var difference = startX+width - (map.width - 1);
				if(difference >= 0){
					return width - difference;
				}	
			}else{
				var difference = startX-width;
				if(difference <= 0){
					return width + difference;
				}
			}
			
			return width;
		},
		/**
		* Make sure the startY+height does not go off range from the map
		*/
		capHeight: function(startY, height, map, direction){
			var _direction = direction || 'S';
			if(_direction == 'S'){
				var difference = startY + height - (map.height-1);
				if(difference >= 0){
					return height - difference;
				}	
			}else{
				var difference = startY - height;
				if(difference <= 0){
					return height + difference;
				}
			}
			
			return height;
		},
		makeRoomBasedOnDoor: function(door, map){
			var startX = 0,
				startY = 0, 
				width = 0, 
				height = 0;
			var maxWidth = 10,
				maxHeight = 10;
			var newDoor = {};

			width = this.getRandomInt(5, maxWidth);
			height = this.getRandomInt(5, maxHeight);

			switch(door.d){
				case 'N':
					startX = door.x - width/2;
					startY = door.y - height;
					newDoor.d = 'S';
					newDoor.x = door.x;
					newDoor.y = door.y-1;
					break;
				case 'S':
					startX = door.x - width/2;
					startY = door.y;
					newDoor.d = 'N';
					newDoor.x = door.x;
					newDoor.y = door.y+1;
					break;
				case 'E':
					startY = door.y - height/2;
					startX = door.x;
					newDoor.d = 'W';
					newDoor.x = door.x+1;
					newDoor.y = door.y;
					break;
				case 'W':
					startY = door.y - height/2;
					startX = door.x - width;
					newDoor.d = 'E';
					newDoor.x = door.x-1;
					newDoor.y = door.y;
					break;
			}
			// if(door.type == 'crossing'){
			//  	newDoor = null;
			// }	
			return this.makeRoom(this.capX(Math.floor(startX), map), this.capY(Math.floor(startY), map), width, height, map, newDoor);
		},
		makeRoom: function(x, y, width, height, map, door){
			var w = this.capWidth(x, width, map);
			var h = this.capHeight(y, height, map);

			//select random type of room design
			var room = this.designSquareRoom(x,y,w,h,map, door);			
			return room;
		},
		designEntrance: function(startX, startY, width, height, map, direction){
			var w = this.capWidth(startX, width, map);
			var h = this.capHeight(startY, height, map);			
			var d = direction ? direction : 'E';

			if(w < 3 || h < 3){
				return null;
			}

			var entrance = null;
			switch(d){
				case 'E': entrance = {
						x: startX+w-1,
						y: Math.floor(startY+(h/2)),
						d: d
					};
					break;
				case 'W': entrance = {
						x: startX,
						y: Math.floor(startY+(h/2)),
						d: d
					};
					break;
				case 'N': entrance = {
						x: Math.floor(startX+(w/2)),
						y: startY,
						d: d
					};
					break;
				case 'S': entrance = {
						x: Math.floor(startX+(w/2)),
						y: startY+h-1,
						d: d
					}	
			}

			return {type: 'entrance', x: startX, y:startY, width: w, height: h, entrance: entrance, doors: []};
		},
		designSquareRoom: function(startX, startY, width, height, map, door){
			
			//iterate through each room, check if it overlaps
			var overlap = false;
			var rooms = map.rooms;
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

			var doors = [];
			if(door){
				doors.push(door);	
			}			

			return {type : 'square', x: startX, y: startY, width: width, height: height, doors : doors};
		},
		designCrossRoom: function(startX, startY, width, height, map){
			//TODO: Design cross room
		},	
		designHallway: function(possibleDoor, map){
			//create random length of hallway
			var lengthTry = this.getRandomInt(1,10);
			var hallway = {
				d: possibleDoor.d,
				x: possibleDoor.x,
				y: possibleDoor.y
			};

			//for checking overlaps
			var height = 1,
				width = 1,
				startX = possibleDoor.x,
				startY = possibleDoor.y;
			
			switch(possibleDoor.d){
				case 'N':
					//cap the hallway length
					var length = this.capHeight(possibleDoor.y, lengthTry, map, 'N');
					hallway.length = length;
					height = length;
					startY = possibleDoor.y - length;					
					break;
				case 'S':
					var length = this.capHeight(possibleDoor.y, lengthTry, map, 'S');
					//TODO: Probably a bigger problem on the boundaries for hallway S
					hallway.length = length - 1;
					height = length - 1;
					break;
				case 'E':
					var length = this.capWidth(possibleDoor.x, lengthTry, map, 'E');
					hallway.length = length;
					width = length;
					break;
				case 'W':
					var length = this.capWidth(possibleDoor.x, lengthTry, map, 'W');
					hallway.length = length;
					width = length;
					startX = possibleDoor.x-length;
					break;
			}

			//Iterate through each room. check if it overlaps
			var overlapped = false;
			if(map.rooms){
				map.rooms.forEach(function(room){
					if (room.x < startX+width && room.x+room.width > startX &&
		    			room.y < startY+height && room.y+room.height > startY){		    			
						overlapped = true;
					}			
				});
			}

			if(overlapped || hallway.length < 4){				
				return null;
			}			

			return hallway;
		},
		getHallwayCrossing: function(hallway, map){
			var that = this;
			
			var directions = ['N', 'S', 'E', 'W'];
			var direction = 'N';
			for(var i = 0; i < 30; i++){
				var doorTry = {};
				var correctLength = hallway.length - 1;
				switch(hallway.d){
					case 'N':
						directions = ['N', 'E', 'W'];
						direction = directions[Math.floor(Math.random() * 3)];
						doorTry.d = direction;
						if(direction == 'N'){							
							doorTry.x = hallway.x;
							doorTry.y = hallway.y - correctLength
						}else{
							doorTry.x = hallway.x;
							doorTry.y = that.getRandomInt(hallway.y - correctLength, hallway.y);
						}
						break;
					case 'S':
						directions = ['S', 'E', 'W'];
						direction = directions[Math.floor(Math.random() * 3)];
						doorTry.d = direction;
						if(direction == 'S'){
							doorTry.x = hallway.x;
							doorTry.y = hallway.y + correctLength;
						}else{
							doorTry.x = hallway.x;
							doorTry.y = that.getRandomInt(hallway.y, hallway.y + correctLength);
						}
						break;
					case 'E':
						directions = ['N', 'S', 'E'];
						direction = directions[Math.floor(Math.random() * 3)];
						doorTry.d = direction;
						if(direction == 'E'){
							doorTry.y = hallway.y;
							doorTry.x = hallway.x + correctLength;							
						}else{
							doorTry.y = hallway.y;
							doorTry.x = that.getRandomInt(hallway.x, hallway.x + correctLength);
						}
						break;
					case 'W':
						directions = ['N', 'S', 'W'];
						direction = directions[Math.floor(Math.random() * 3)];
						doorTry.d = direction;
						if(direction == 'W'){
							doorTry.y = hallway.y;
							doorTry.x = hallway.x - correctLength;
						}else{
							doorTry.y = hallway.y;
							doorTry.x = that.getRandomInt(hallway.x - correctLength, hallway.x);
						}
						break;
				}
				
				if(doorTry.d){
					doorTry.type = 'crossing';
					return doorTry;
				}
			}

			return null;				
		},
		getPossibleDoorway: function(room, map){
			var that = this;
			var doorBuffer = 3; //so doors wouldn't appear on boundaries
			//look for doorway per type of room
			function findDoorInSquare(room){			
				var directions = ['N', 'S', 'E', 'W'];
				var entrance = room.entrance;				
				//try 30 times to look for a door
				for(var i = 0; i < 30; i++){
					//pick a random face or direction
					var direction = directions[Math.floor(Math.random()*4)];
					var doorTry = null;					
					switch(direction){
						case 'N': 
							//check if this door is on a boundary
							if(room.y > doorBuffer){
								doorTry = {
									d: direction,
									x: that.getRandomInt(room.x+1, room.x+room.width-2),
									y: room.y
								}
							}
							break;
						case 'S':
							if(room.y + room.height-1 < map.height-doorBuffer){
								doorTry = {
									d: direction,
									x: that.getRandomInt(room.x+1, room.x+room.width-2),
									y: room.y + room.height-1
								}
							}
							break;
						case 'E':
							if(room.x + room.width-1 < map.width - doorBuffer){
								doorTry = {
									d: direction,
									x: room.x + room.width-1,
									y: that.getRandomInt(room.y+1, room.y+room.height-2)
								}
							}
							break;
						case 'W':
							if(room.y> doorBuffer){
								doorTry = {
									d: direction,
									x: room.x,
									y: that.getRandomInt(room.y+1, room.y+room.height-2)
								}
							}
							break;
					}

					if(doorTry){
						//search if it's adjacent to the entrance
						if(entrance){
							if(that.isAdjacentOrtho(doorTry, entrance)){
								continue;
							}
						}
						doorTry.type='room';
						//Door found!
						return doorTry;
					}
				}

				//Door wasn't found
				return null;				
			}

			switch(room.type){
				case 'entrance': 
				case 'square':
					return findDoorInSquare(room);
			}

			return null;
		},
		getRandomRoom: function(rooms){
			var i = Math.floor(Math.random() * rooms.length);
			return rooms[i];
		},
		getRandomHallway: function(hallways){
			var i = Math.floor(Math.random() * hallways.length);
			return hallways[i];
		}
	}
}(typeof module === 'undefined' ? this.rogueEngine = {} : module));