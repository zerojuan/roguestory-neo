
function DungeonController($scope, $http, $location, authService, CommonAppState){
	//get the map
	$scope.map = [];
	var rows = 38;
	var cols = 80;
	for(var y = 0; y < rows; y++){
		$scope.map[y] = [];
		for(var x = 0; x < cols; x++){
			var val = 65 + (Math.round((Math.random() * ((70 - 65) + 1))));						
			$scope.map[y][x] = {
				val : CommonAppState.ValueMap['wall_top'],
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

	$scope.updateMap = function(){
		var rows = 38;
		var cols = 80;
		for(var y = 0; y < rows; y++){
			$scope.map[y] = [];
			for(var x = 0; x < cols; x++){
				var val = 65 + (Math.round((Math.random() * ((70 - 65) + 1))));						
				$scope.map[y][x] = {
					val : CommonAppState.ValueMap['wall_top'],
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