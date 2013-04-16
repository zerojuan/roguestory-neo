'use strict';

/* Services */


// Demonstrate how to register services
angular.module('myApp.services', []).  
  factory('CommonAppState', ['$rootScope', function($rootScope){
  	var commonAppService = {};    

  	commonAppService.loggedInUser = null;
    commonAppService.ValueMap = {};

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