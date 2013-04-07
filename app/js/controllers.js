'use strict';

/* Controllers */

function LoginController($scope, $http, $location, authService){
	$scope.username = 'tusongtupa';
	$scope.password = 'testpass';
	console.log('Login Controller');
	$scope.submit = function(){
		var data = {username: $scope.username, password: $scope.password};
		$http.post('/auth/login', data).success(function(){				
			authService.loginConfirmed();
		});
	};	

	$scope.$on('event:auth-loginConfirmed', function(){		
		$location.path('/home');
	});
}

function HomeController($scope, $http, $location, authService){
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
			$location.path('/login');
		});
	}
}

function MyCtrl1() {}
MyCtrl1.$inject = [];


function MyCtrl2() {
}
MyCtrl2.$inject = [];
