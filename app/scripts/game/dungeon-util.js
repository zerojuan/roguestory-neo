(function(){
	'use strict';

	angular.module('myApp.gameModule')
		.factory('DungeonUtil', ['AppRegistry', function(AppRegistry){
			var DungeonUtil = {};

			DungeonUtil.isGround = function(coord, map){
				var mapVal = map[coord.row][coord.col];
				return (mapVal.val == AppRegistry.ValueMap['door_open']) || (mapVal.material == 'EARTH');
			}

			DungeonUtil.removeDoubleDoors = function(map){
				var marked = [];
				for(var row = 0; row < map.length; row++){
					for(var col = 0; col < map[row].length; col++){
						var score = 0;
						var door = AppRegistry.ValueMap['door_open'];
						if(map[row][col].val == door){
							//check perpendicular, if it's the same
							if((row-1 > -1 && map[row-1][col].val == door)){
								//console.log("TOP-MID");
								score++;
							}
							if((col-1 > -1 && map[row][col-1].val == door)){
								//console.log("MID-LEFT");
								score++;
							}
							if((col+1 < map[row].length && map[row][col+1].val == door)){
								//console.log("MID_RIGHT");
								score++;
							}
							if((row+1 < map.length && map[row+1][col].val == door)){
								//console.log("BOTTOM-MID");
								score++;
							}
							if(score > 0){
								marked.push({row: row, col: col});
							}
						}
					}
				}

				angular.forEach(marked, function(value){
					map[value.row][value.col] = {
						val : '`',
						material: 'EARTH',
						visibility: 0
					}
				});
			}

			DungeonUtil.removeHangingDoors = function(map){
				var marked = [];
				for(var row = 0; row < map.length; row++){
					for(var col = 0; col < map[row].length; col++){
						var isHanging = true;
						var wall = AppRegistry.ValueMap['wall'];
						if(map[row][col].val == AppRegistry.ValueMap['door_open'] ||
							map[row][col].val == AppRegistry.ValueMap['door_close']){
							//check perpendicular, if it's the same
							if((row-1 > -1 && map[row-1][col].val == wall) &&
								(row+1 < map.length && map[row+1][col].val == wall)){
								//console.log("TOP-MID");
								//console.log("BOTTOM-MID");
								isHanging = false;
							}
							if((col-1 > -1 && map[row][col-1].val == wall) &&
								(col+1 < map[row].length && map[row][col+1].val == wall)){
								//console.log("MID-LEFT");
								//console.log("MID_RIGHT");
								isHanging = false;
							}

							if(isHanging){
								marked.push({row: row, col: col});
							}
						}
					}
				}

				angular.forEach(marked, function(value){
					map[value.row][value.col] = {
						val : '`',
						material: 'EARTH',
						visibility: 0
					}
				});
			}

			DungeonUtil.removeDoubleLockedDoors = function(map){				
				for(var row = 0; row < map.length; row++){
					for(var col = 0; col < map[row].length; col++){						
						var doorClose = AppRegistry.ValueMap['door_close'];
						if(map[row][col].val == doorClose){
							//check perpendicular, if it's the same
							if(row+1 < map.length && map[row+1][col].val == doorClose){								
								//console.log("BOTTOM-MID");
								map[row][col] = {
									val: '.',
									material: 'EARTH',
									visibility: 0
								}
							}
							if(col+1 < map[row].length && map[row][col+1].val == doorClose){
								//console.log("MID-LEFT");
								//console.log("MID_RIGHT");
								map[row][col] = {
									val: AppRegistry.ValueMap['stone'],
									material: 'EARTH',
									visibility: 0
								}
							}
						}
					}
				}
			}

			DungeonUtil.renderWalls = function(map){
				for(var row = 0; row < map.length; row++){
					for(var col = 0; col < map[row].length; col++){
						var score = 0;
						if(map[row][col].val != '0'){
							continue;
						}
						if((row-1 > -1 && map[row-1][col].material == 'EARTH')){
							//console.log("TOP-MID");
							score++;
						}
						if((row-1 > -1 && col-1 > -1 && map[row-1][col-1].material == 'EARTH')){
							//console.log("TOP LEFT");
							score++;
						}
						if((row-1 > -1 && col+1 < map[row].length && map[row-1][col+1].material == 'EARTH')){
							//console.log("TOP RIGHT");
							score++;
						}
						if((col+1 < map[row].length && map[row][col+1].material == 'EARTH')){
							//console.log("MID_RIGHT");
							score++;
						}
						if((col-1 > -1 && map[row][col-1].material == 'EARTH')){
							//console.log("MID-LEFT");
							score++;
						}
						if((row+1 < map.length && col-1 > -1 && map[row+1][col-1].material == 'EARTH')){
							//console.log("BOTTOM LEFT");
							score++;
						}
						if((row+1 < map.length && col+1 < map[row].length && map[row+1][col+1].material == 'EARTH')){
							//console.log("BOTTOM-RIGHT");
							score++;
						}
						if((row+1 < map.length && map[row+1][col].material == 'EARTH')){
							//console.log("BOTTOM-MID");
							score++;
						}
						if(score>0){					
							map[row][col] = {
								val: AppRegistry.ValueMap['wall'],
								material: 'STONE',
								solid: true,
								visibility: 0
							}	
						}
						
					}
				}
			}

			DungeonUtil.renderEntrance = function(data, map){
				for(var i  = data.x; i < data.x+data.width; i++){
					for(var j = data.y; j < data.y+data.height; j++){
						var val = {};
						if((i==data.x || i == data.x+data.width-1) || 
							(j==data.y || j==data.y+data.height-1)){
							val = {
								val : AppRegistry.ValueMap['wall'],
								material: 'STONE',
								solid: true,
								visibility: 0
							}
						}else{
							val = {
								val : '`',
								material: 'EARTH',
								visibility: 0
							}
						}
						map[j][i] = val;
					}			
				}
				var entrance = {
					val : AppRegistry.ValueMap['up_stairs'],
					material : 'STONE',
					visibility: 0
				};
				map[data.entrance.y][data.entrance.x] = entrance;

				for(var i = 0; i < data.doors.length; i++){
					var door = data.doors[i];
					map[door.y][door.x] = {
						val: AppRegistry.ValueMap['door_close'],
						material: 'STONE',
						visibility: 0
					}
				}
			}

			DungeonUtil.renderHallway = function(data, map){		
				switch(data.d){
					case 'N':
						for(var i = data.y; i > data.y-data.length; i--){
							//console.log("NORTH");
							map[i][data.x] = {
								val : '`',
								material: 'EARTH',
								visibility: 0
							};
						}
						break;
					case 'S':
						for(var i = data.y; i < data.y+data.length; i++){
							//console.log("SOUTH");
							map[i][data.x] = {
								val: '`',
								material: 'EARTH',
								visibility: 0
							}
						}
						break;
					case 'E':
						for(var i = data.x; i < data.x+data.length; i++){
							//console.log("EAST");
							map[data.y][i] = {
								val: '`',
								material: 'EARTH',
								visibility: 0
							}
						}
						break;
					case 'W':
						for(var i = data.x; i > data.x-data.length; i--){
							//console.log("WEST");
							map[data.y][i] = {
								val: '`',
								material: 'EARTH',
								visibility: 0
							}
						}
						break;
				}
				//if(data.type == 'room'){
					map[data.y][data.x] = {
						val: AppRegistry.ValueMap['door_open'],
						material: 'STONE',
						visibility: 0
					}	
				//}				
			}

			DungeonUtil.renderSquareRoom = function(data, map){
				for(var i = data.x; i < data.x+data.width; i++){
					for(var j = data.y; j < data.y+data.height; j++){
						var val = {};

						if(i == data.x || i == data.x+data.width-1){
							val = {
								val : AppRegistry.ValueMap['wall'],
								material: 'STONE',
								solid: true,
								strength: Math.random(),
								visibility: 0
							}
						}else if(j == data.y || j==data.y+data.height-1){
							val = {
								val : AppRegistry.ValueMap['wall'],
								material: 'STONE',
								solid: true,
								strength: Math.random(),
								visibility: 0
							}
						}else{
							val = {
								val : '.',
								material: 'EARTH',
								pulse : Math.random(),
								visibility: 0
							}
						}						
						map[j][i] = val;				
					}
				}

				for(var i = 0; i < data.doors.length; i++){
					var door = data.doors[i];
					map[door.y][door.x] = {
						val: AppRegistry.ValueMap['door_close'],
						material: 'STONE',
						visibility: 0
					}
				}
			}

			DungeonUtil.getHeroEntrancePosition = function(room){
				var entrance = room.entrance;
				var position = null;
				switch(entrance.d){
					case 'E': position = {
								col: entrance.x - 1,
								row: entrance.y
							};
							break;
					case 'W': position = {
								col: entrance.x + 1,
								row: entrance.y
							};
							break;
					case 'N': position = {
								col: entrance.x,
								row: entrance.y + 1
							};
							break;
					case 'S': position = {
								col: entrance.x,
								row: entrance.y - 1
							};
							break;
				}
				return position;
			}

			return DungeonUtil;
		}]);
}());