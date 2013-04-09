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