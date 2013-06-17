'use strict';

function HomeController($scope, $http, $location, authService, AppRegistry, PathFinder){
	$scope.loggedIn = false;
	$scope.selectedTile = {x: 5, y: 5};
	$scope.playerPosition = AppRegistry.playerPosition;

	$http.get('/home').success(function(data){
		$scope.loggedIn = true;
		$scope.message = data.message;
		$scope.user = data.user;
		console.log('ValueMap: ', data);
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
	});

	$scope.$on('handleBroadcast[map]', function(){
		//MAP IS READY

		//Service takes care of identifying the tiles based on the [map] and values
	});

	$scope.$on('onClickedOnMap', function(evt, x, y){
		$scope.selectedTile.x = x;
		$scope.selectedTile.y = y;

	  //TODO: execute path movement
		$scope.$apply();
	});


	$scope.$on('onMouseOverMapChanged', function(evt, x, y){
		$scope.selectedTile.x = x;
		$scope.selectedTile.y = y;

		//TODO: create a service for converting tiledata to description

		var path = PathFinder.findPath({row: $scope.playerPosition.y, col: $scope.playerPosition.x},
												{row: y, col: x}, AppRegistry.map);

		//TODO: create path renderer

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
HomeController.$inject = ['$scope', '$http', '$location', 'authService', 'AppRegistry', 'PathFinder'];