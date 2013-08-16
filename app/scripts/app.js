'use strict';

////Taken from http://will.thimbleby.net/astar.js
//Array.prototype.insertSorted = function(v, sortFn){
//	if(this.length < 1 || sortFn(v, this[this.length-1]) >= 0) {
//		this.push(v);
//		return this;
//	}
//	for(var i=this.length-2; i>=0; --i) {
//		if(sortFn(v, this[i]) >= 0) {
//			this.splice(i+1, 0, v);
//			return this;
//		}
//	}
//	this.splice(0, 0, v);
//	return this;
//}

angular.module('rs.services', []);

angular.module('rs.gameModule', ['rs.services']);

angular.module('myApp.directives', ['rs.gameModule','http-auth-interceptor']);

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'rs.services', 'myApp.directives']).
  config(['$routeProvider', function($routeProvider) {    
    $routeProvider.when('/login', {templateUrl: 'views/login.html', controller: LoginController});
    $routeProvider.when('/', {templateUrl: 'views/home.html', controller: HomeController});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
