'use strict';

/* Controllers */

function LoginController($scope, $http, $location, authService, CommonAppState){
	$scope.username = 'tusongtupa';
	$scope.password = 'testpass';
	console.log('Login Controller');
	$scope.submit = function(){
		var data = {username: $scope.username, password: $scope.password};
		$http.post('/auth/login', data).success(function(data){			
			if(data.error){
				$scope.flashError = data.message;
				return;
			}
			CommonAppState.prepForBroadcast('loggedInUser', data.user);			
			authService.loginConfirmed();
		});
	};

	if(CommonAppState.loggedInUser){
		$location.path('/home');		
	}

	$scope.$on('event:auth-loginConfirmed', function(){			
		$location.path('/home');
	});
}
LoginController.$inject = ['$scope', '$http', '$location', 'authService', 'CommonAppState'];

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
