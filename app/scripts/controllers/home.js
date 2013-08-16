'use strict';

function HomeController($scope, $http, $location, $timeout, authService, AppRegistry, PathFinder, LineOfSight, MoveManager){
	$scope.loggedIn = false;
	$scope.selectedTile = {row: 5, col: 5};
	$scope.playerPosition = AppRegistry.playerPosition;
	$scope.timestep = AppRegistry.timestep;

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

	$scope.$on('handleBroadcast[timestep]', function(){
		$scope.timestep = AppRegistry.timestep;
		$scope.$apply('timestep');
	})

	$scope.$on('handleBroadcast[playerPosition]', function(){
		$scope.playerPosition = AppRegistry.playerPosition;
		LineOfSight.doLOS(AppRegistry.playerPosition, 5, AppRegistry.map);
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

	$scope.$on('onKeyEvent', function(evt, move){
		MoveManager.validateMove(move, AppRegistry.map);
	});

	$scope.$on('onClickedOnMap', function(evt, col, row){
		$scope.selectedTile.col = col;
		$scope.selectedTile.row = row;

		var move;
		if(AppRegistry.map[row][col].val == AppRegistry.ValueMap['door_close']){
			//check if clicked on closed door
			move = {type:'action', data: {
				type: 'door_open',
				position: {
					row: row,
					col: col
				}
			}};
			if(MoveManager.validateMove(move, AppRegistry.map)){
				MoveManager.executeMove(move, AppRegistry.map);
			};
			return;
		}else if(AppRegistry.map[row][col].val == AppRegistry.ValueMap['door_open']){
			move = {type:'action', data: {
				type: 'door_close',
				position: {
					row: row,
					col: col
				}
			}};
			if(MoveManager.validateMove(move, AppRegistry.map)){
				MoveManager.executeMove(move, AppRegistry.map);
			};
			return;
		}

		if(AppRegistry.playerIsMoving || !AppRegistry.moveList){
			AppRegistry.playerIsMoving = false;
			return;
		}



		AppRegistry.prepForBroadcast('playerIsMoving', true);
		MoveManager.executeMove({type: 'movelist'});

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
			AppRegistry.prepForBroadcast('moveList', path);
			$scope.$apply();

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
HomeController.$inject = ['$scope', '$http', '$location', '$timeout', 'authService', 'AppRegistry', 'PathFinder', 'LineOfSight', 'MoveManager'];