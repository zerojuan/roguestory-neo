'use strict';

function HomeController($scope, $http, $location, authService, CommonAppState){
	$http.get('/home').success(function(data){
		console.log(data);
		$scope.message = data.message;
		$scope.user = data.user;
		authService.loginConfirmed();
	});

	$scope.$on('event:auth-loginRequired', function(){
		console.log('Login Required');
  		$location.path('/login');
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