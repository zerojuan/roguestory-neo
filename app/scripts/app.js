'use strict';


angular.module('myApp.directives', ['myApp.gameModule','http-auth-interceptor']);

// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', function($routeProvider) {    
    $routeProvider.when('/login', {templateUrl: 'views/login.html', controller: LoginController});
    $routeProvider.when('/', {templateUrl: 'views/home.html', controller: HomeController});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
