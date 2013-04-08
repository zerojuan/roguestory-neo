'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('myApp.services', []).
  value('version', '0.1-2').
  factory('CommonAppState', ['$rootScope', function($rootScope){
  	var commonAppService = {};

  	commonAppService.loggedInUser = null;

  	commonAppService.prepForBroadcast = function(property, msg){
  		console.log('Saving Property: ', property, msg);
  		this[property] = msg;
  		this.broadcastItem(property);
  	}

  	commonAppService.broadcastItem = function(property){
  		$rootScope.$broadcast('handleBroadcast['+property+']');
  	}

  	return commonAppService;
  }]);