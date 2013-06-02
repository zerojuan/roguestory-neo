
function DungeonController($scope, $http, $location, authService, CommonAppState, DungeonUtil){
	//get the map
	$scope.map = [];
		

	$http.get('/dungeon').success(function(data){
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
	});

	

	$scope.updateMap = function(){
		var rows = 38;
		var cols = 80;
		for(var y = 0; y < rows; y++){
			$scope.map[y] = [];
			for(var x = 0; x < cols; x++){
				var val = 65 + (Math.round((Math.random() * ((70 - 65) + 1))));						
				$scope.map[y][x] = {
					val : CommonAppState.ValueMap['hero'],
					ga : Math.random(),
					tint : {
						r : Math.round(Math.random()*255),
						g : Math.round(Math.random()*255),
						b : Math.round(Math.random()*255),
						t : 0.6
					}
				}
				
			}
		}		
	}
}
DungeonController.$inject = ['$scope', '$http', '$location', 'authService', 'CommonAppState', 'DungeonUtil'];