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
			var features = 300;
			var featureTry = 0;
			var room_percentage = 50; //chance for room
			var corridor_percentage = 50; //chance for corridor			

			//randomly create features
			for(featureTry = 0; featureTry < features; featureTry++){
				
				var new_x = 0,
					new_y = 0,
					mod_x = 0,
					mod_y = 0,
					valid_tile = -1;

				//Randomly look for a room/corridor that we can punch an extension in
				var currRoom = GH.getRandomRoom(dungeonData.rooms);
				var possibleDoor = GH.getPossibleDoorway(currRoom, dungeonData);

				//Decide on what feature to make
				if(currRoom){
					//draw a hallway
					var hallway = GH.designHallway(currRoom, possibleDoor, dungeonData);
					if(hallway)
						dungeonData.hallways.push(hallway);
				}

				var room = GH.makeRoom(Math.round(Math.random() * cols) , Math.round(Math.random() * rows), 
					Math.round(Math.random() * 20 + 3), Math.round(Math.random() * 20 + 3), dungeonData, possibleDoor);

				if(room){
					dungeonData.rooms.push(room);
				}				
			}

			
			return dungeonData;
		}		
	}

}(typeof module === 'undefined' ? this.rogueEngine = {} : module));