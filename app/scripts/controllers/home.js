'use strict';

function HomeController($scope, $http, $location, authService, CommonAppState){
	$scope.loggedIn = false;
	$scope.selectedTile = {x: 5, y: 5};
	$http.get('/home').success(function(data){
		$scope.loggedIn = true;
		$scope.message = data.message;
		$scope.user = data.user;
		console.log('ValueMap: ', data);
		CommonAppState.ValueMap = data.valueMap;
		$http.defaults.headers.common['Auth-Token'] = 'my-token-so';
		authService.loginConfirmed();
	});

	$scope.$on('event:auth-loginRequired', function(){
		console.log('Login Required');
  		$location.path('/login');
  	});

  	$scope.$on('onClickedOnMap', function(evt, x, y){
  		console.log("Clicked on Map Yo!", x, y);
  		$scope.selectedTile.x = x;
  		$scope.selectedTile.y = y;
  		$scope.$apply();
  	});
	
	$scope.logout = function(){
		$http.post('auth/logout').success(function(){
			$scope.isLoggedIn = false;
			CommonAppState.loggedInUser = null;
			$location.path('/login');
		});
	}
}
HomeController.$inject = ['$scope', '$http', '$location', 'authService', 'CommonAppState'];