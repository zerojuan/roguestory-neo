'use strict';

function HomeController($scope, $http, $location, $timeout, authService, AppRegistry, PathFinder, LineOfSight){
	$scope.loggedIn = false;
	$scope.selectedTile = {row: 5, col: 5};
	$scope.playerPosition = AppRegistry.playerPosition;

	$http.get('/home').success(function(data){
		$scope.loggedIn = true;
		$scope.message = data.message;
		$scope.user = data.user;
		AppRegistry.ValueMap = data.valueMap;
		$http.defaults.headers.common['Auth-Token'] = 'my-token-so';
		authService.loginConfirmed();
	});

	$scope.$on('event:auth-loginRequired', function(){
		console.log('Login Required');
  		$location.path('/login');
  	});

	$scope.$on('handleBroadcast[playerPosition]', function(){
		$scope.playerPosition = AppRegistry.playerPosition;
		$scope.$apply();
		console.log("PlayerPosition has changed", $scope.playerPosition);
	});

	$scope.$on('handleBroadcast[map]', function(){
		//MAP IS READY
		console.log('MAP IS READY!');
		console.log('Player Position: ', AppRegistry.playerPosition);
		LineOfSight.doLOS(AppRegistry.playerPosition, 5, AppRegistry.map);
		//Service takes care of identifying the tiles based on the [map] and values
	});

	$scope.$on('onClickedOnMap', function(evt, col, row){
		$scope.selectedTile.col = col;
		$scope.selectedTile.row = row;

		if(AppRegistry.playerIsMoving || !AppRegistry.moveList){
			console.log('Player is Moving: ' + AppRegistry.playerIsMoving + ' or Movelist doesn\'t exist: ' + AppRegistry.moveList);
			AppRegistry.playerIsMoving = false;
			return;
		}

		var currIndex = 0;
		var doMove = function(){
			var currMove = AppRegistry.moveList[currIndex];
			LineOfSight.doLOS(currMove, 5, AppRegistry.map);
			if(currMove && AppRegistry.playerIsMoving){ //a move exists
				AppRegistry.prepForBroadcast('playerPosition', currMove);
				currIndex++;
				$timeout(doMove, 50);
			}else{
				AppRegistry.prepForBroadcast('moveList', null);
				AppRegistry.prepForBroadcast('playerIsMoving', false);
				return;
			}
		}

		AppRegistry.prepForBroadcast('playerIsMoving', true);
		if(AppRegistry.moveList){
			doMove();
		}

	});


	$scope.$on('onMouseOverMapChanged', function(evt, col, row){
		$scope.selectedTile.col = col;
		$scope.selectedTile.row = row;

		if(AppRegistry.playerIsMoving){
			return;
		}

		if(AppRegistry.map[row][col].visibility == 0){
			return;
		}

		//TODO: create a service for converting tiledata to description

		var path = PathFinder.findPath({row: $scope.playerPosition.row, col: $scope.playerPosition.col},
												{row: row, col: col}, AppRegistry.map);
//		if(path){
			AppRegistry.prepForBroadcast('moveList', path);
			$scope.$apply();
//		}else{
//			AppRegistry.moveList = null;
//		}

	});

	$scope.logout = function(){
		$http.post('auth/logout').success(function(){
			$scope.isLoggedIn = false;
			AppRegistry.loggedInUser = null;
			$location.path('/login');
		});
	}

	$scope.$on('')
}
HomeController.$inject = ['$scope', '$http', '$location', '$timeout', 'authService', 'AppRegistry', 'PathFinder', 'LineOfSight'];