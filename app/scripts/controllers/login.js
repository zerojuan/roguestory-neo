'use strict';

/* Controllers */
angular.module('myApp.controllers')
	.controller('LoginController', ['$scope', '$http', '$location', 'authService', 'AppRegistry',
	function($scope, $http, $location, authService, AppRegistry){
		$scope.username = '';
		$scope.password = '';
		console.log('Login Controller');
		$scope.submit = function(){
			var data = {username: $scope.username, password: $scope.password};
			$http.post('/auth/login', data).success(function(data){
				console.log('Recieved data: ', data);		
				if(data.error){
					$scope.flashError = data.message;
					return;
				}
				AppRegistry.prepForBroadcast('loggedInUser', data.user);
				authService.loginConfirmed();
			});
		};

		//if(CommonAppState.loggedInUser){
		////	$location.path('/home');
		//}

		$scope.$on('event:auth-loginConfirmed', function(){
			$location.path('/home');
		});
}]);
