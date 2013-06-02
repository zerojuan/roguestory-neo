(function(module){
	var ValueMap = require('./valuemap');
	var GH = require('./generatorhelper');

	module.exports = {
		generateDungeon : function(size, level){
			var dungeonData = {
				rooms : [],
				hallways: [],
				width: size.width,
				height: size.height
			};
			var map = [];
			var rows = size.height; //38;
			var cols = size.width; //80;
						

			//DIG OUT A SINGLE ROOM IN THE CORNER
			var entrance = GH.designEntrance(cols-10, 10, 10, 10, map);
			dungeonData.rooms.push(entrance);
			
			//decide on how many feature tries this dungeon will have
			var features = 1000;
			var featureTry = 0;
			var room_percentage = 50; //chance for room
			var corridor_percentage = 50; //chance for corridor			

			//randomly create features
			for(featureTry = 0; featureTry < features; featureTry++){
				
				var new_x = 0,
					new_y = 0,
					mod_x = 0,
					mod_y = 0,
					valid_tile = -1,
					possibleDoor = null;

				//Randomly look for a room/corridor that we can punch an extension to
				var currRoom = GH.getRandomRoom(dungeonData.rooms);
				var currHallway = GH.getRandomHallway(dungeonData.hallways);
				
				//TODO: Decide on what feature to make
				var feature = Math.random() * 100;
				var currFeature = null;
				if(feature <= 50){
					//punch from room
					if(currRoom){
						possibleDoor = GH.getPossibleDoorway(currRoom, dungeonData);	
						currFeature = currRoom;						
					}
					
				}else{
					//punch from hallway
					if(currHallway){
						possibleDoor = GH.getHallwayCrossing(currHallway, dungeonData);	
						currFeature = currHallway;
					}
								
				}

				//what feature should I make?
				feature = Math.random() * 100;
				if(possibleDoor){
					if(feature <= room_percentage){
						//make room						
						var room = GH.makeRoomBasedOnDoor(possibleDoor, dungeonData);					

						if(room){
							console.log("Room created: ", room);
							dungeonData.rooms.push(room);
							if(currFeature == currRoom){
								console.log("Possible door pushed to currRoom", possibleDoor, currRoom);
								currRoom.doors.push(possibleDoor);
							}
						}
					}else{
						//make hallway						
						var hallway = GH.designHallway(possibleDoor, dungeonData);
						if(hallway){
							console.log("Hallway created: ", hallway);
							console.log("Possible door from: ", currFeature);
							dungeonData.hallways.push(hallway);
						}
						
					}		
				}
														
			}

			
			return dungeonData;
		}		
	}

}(typeof module === 'undefined' ? this.rogueEngine = {} : module));