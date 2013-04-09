'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['myApp.filters', 'myApp.services', 'myApp.directives']).
  config(['$routeProvider', function($routeProvider) {    
    $routeProvider.when('/login', {templateUrl: 'partials/login.html', controller: LoginController});
    $routeProvider.when('/', {templateUrl: 'partials/home.html', controller: HomeController});
    $routeProvider.otherwise({redirectTo: '/'});
  }]);
