
function DungeonController($scope, $http, $location, authService, AppRegistry, DungeonUtil){
	//get the map
	$scope.map = [];

	$http.get('/dungeon').success(function(data){
		console.log("GOTTEN THE DUNGEON!");
		$scope.map = [];
		for(var y = 0; y < data.height; y++){
			$scope.map[y] = [];
			for(var x = 0; x < data.width; x++){
				$scope.map[y][x] = {
					val : '0'
				};
			}
		}
		//decode dungeon data
		var rooms = data.rooms;
		for(var i in rooms){
			var room = rooms[i];
			if(room.type == 'square'){
				DungeonUtil.renderSquareRoom(room, $scope.map); 
			}else if(room.type == 'entrance'){
				DungeonUtil.renderEntrance(room, $scope.map);
				var playerPosition = DungeonUtil.getHeroEntrancePosition(room);
				$scope.map[playerPosition.row][playerPosition.col] = {
					val : '`',
					material: 'EARTH',
					object : {
						val: AppRegistry.ValueMap['hero'],
						material: 'HERO_NORMAL'
					}
				}
			}
		}

		var hallways = data.hallways;
		for(var i in hallways){
			var hallway = hallways[i];
			DungeonUtil.renderHallway(hallway, $scope.map);
		}

		DungeonUtil.renderWalls($scope.map);
		DungeonUtil.removeDoubleDoors($scope.map);		
		DungeonUtil.removeDoubleLockedDoors($scope.map);
		DungeonUtil.removeHangingDoors($scope.map);

		//tell the rest of the app that a map is ready
		console.log("I AM PREPPING FOR BROADCAST");
		AppRegistry.prepForBroadcast('map', $scope.map);
		AppRegistry.prepForBroadcast('playerPosition', playerPosition);
	});
}
DungeonController.$inject = ['$scope', '$http', '$location', 'authService', 'AppRegistry', 'DungeonUtil'];