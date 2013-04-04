'use strict';

/* Controllers */

function LoginController($scope, $http, authService){
	$scope.username = 'Julius';
	$scope.password = 'testacool';
	$scope.submit = function(){
		var data = {username: $scope.username, password: $scope.password};
		$http.post('/auth/login', data).success(function(){
			authService.loginConfirmed();
		});
	};
}

function HomeController($scope, $http, authService){
	$http.get('/home').success(function(data){
		console.log(data);
		authService.loginConfirmed();
	});
}

function MyCtrl1() {}
MyCtrl1.$inject = [];


function MyCtrl2() {
}
MyCtrl2.$inject = [];
