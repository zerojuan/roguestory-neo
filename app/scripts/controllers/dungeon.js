
function DungeonController($scope, $http, $location, authService, CommonAppState){
	//get the map
	$scope.map = [];
	
	var _renderEntrance = function(data, map){
		for(var i  = data.x; i < data.x+data.width; i++){
			for(var j = data.y; j < data.y+data.height; j++){
				var val = {};
				if((i==data.x || i == data.x+data.width-1) || 
					(j==data.y || j==data.y+data.height-1)){
					val = {
						val : CommonAppState.ValueMap['wall'],
						material: 'STONE'											
					}
				}else{
					val = {
						val : '`',
						material: 'EARTH'
					}
				}
				map[j][i] = val;
			}			
		}
		var entrance = {
			val : CommonAppState.ValueMap['up_stairs'],
			material : 'STONE'
		};
		map[data.entrance.y][data.entrance.x] = entrance;

		map[data.entrance.y][data.entrance.x-1] = {
			val: CommonAppState.ValueMap['hero'],
			material: 'HERO_NORMAL'
		}
	}

	var _renderHallway = function(data, map){		
		switch(data.d){
			case 'N':
				for(var i = data.y; i > data.y-data.length; i--){
					console.log("NORTH");
					map[i][data.x] = {
						val : '`',
						material: 'EARTH'
					};
				}
				break;
			case 'S':
				for(var i = data.y; i < data.y+data.length; i++){
					console.log("SOUTH");
					map[i][data.x] = {
						val: '`',
						material: 'EARTH'
					}
				}
				break;
			case 'E':
				for(var i = data.x; i < data.x+data.length; i++){
					console.log("EAST");
					map[data.y][i] = {
						val: '`',
						material: 'EARTH'
					}
				}
				break;
			case 'W':
				for(var i = data.x; i > data.x-data.length; i--){
					console.log("WEST");
					map[data.y][i] = {
						val: '`',
						material: 'EARTH'
					}
				}
				break;
		}
		map[data.y][data.x] = {
			val: CommonAppState.ValueMap['door_open'],
			material: 'STONE'
		}
	}

	var _renderSquareRoom = function(data, map){
		for(var i = data.x; i < data.x+data.width; i++){
			for(var j = data.y; j < data.y+data.height; j++){
				var val = {};

				if(i == data.x || i == data.x+data.width-1){
					val = {
						val : CommonAppState.ValueMap['wall'],
						material: 'STONE',
						strength: Math.random()
					}
				}else if(j == data.y || j==data.y+data.height-1){
					val = {
						val : CommonAppState.ValueMap['wall'],
						material: 'STONE',
						strength: Math.random()
					}
				}else{
					val = {
						val : '.',
						material: 'EARTH',
						pulse : Math.random()						
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
					val : '0'					
				};
			}
		}
		//decode dungeon data
		var rooms = data.rooms;
		for(var i in rooms){
			var room = rooms[i];
			if(room.type == 'square'){
				_renderSquareRoom(room, $scope.map); 
			}else if(room.type == 'entrance'){
				_renderEntrance(room, $scope.map);
			}
		}

		var hallways = data.hallways;
		for(var i in hallways){
			var hallway = hallways[i];
			_renderHallway(hallway, $scope.map);
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