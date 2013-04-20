
function DungeonController($scope, $http, $location, authService, CommonAppState){
	//get the map
	$scope.map = [];
	
	var _renderSquareRoom = function(data, map){
		for(var i = data.x; i < data.x+data.width; i++){
			for(var j = data.y; j < data.y+data.height; j++){
				var val = {};

				if(i == data.x || i == data.x+data.width-1){
					val = {
						val : CommonAppState.ValueMap['wall'],
						ga : Math.random(),
						tint : {
							r : 255,
							g : 255,
							b : 255,
							t : 0.6
						}
					}
				}else if(j == data.y || j==data.y+data.height-1){
					val = {
						val : CommonAppState.ValueMap['wall'],
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
						val : 'X',
						ga : Math.random(),
						tint : {
							r : 255,
							g : 255,
							b : 255,
							t : 0.6
						}
					}
				}
				map[j][i] = val;				
			}
		}
	}

	$http.get('/dungeon').success(function(data){
		$scope.map = [];
		for(var y = 0; y < data.height; y++){
			$scope.map[y] = [];
			for(var x = 0; x < data.width; x++){
				$scope.map[y][x] = {
					val : '0',
					ga : 0,
					tint : {
						r : Math.round(Math.random()*255),
						g : Math.round(Math.random()*255),
						b : Math.round(Math.random()*255),
						t : 0.6
					}
				};
			}
		}
		//decode dungeon data
		var rooms = data.rooms;
		for(var i in rooms){
			var room = rooms[i];
			if(room.type == 'square'){
				_renderSquareRoom(room, $scope.map); 
			}
		}

		//$scope.map = data;
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
DungeonController.$inject = ['$scope', '$http', '$location', 'authService', 'CommonAppState'];