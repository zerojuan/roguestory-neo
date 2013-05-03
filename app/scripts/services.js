'use strict';

/* Services */


// Demonstrate how to register services
angular.module('myApp.services', []).  
  factory('CommonAppState', ['$rootScope', function($rootScope){
  	var commonAppService = {};    

  	commonAppService.loggedInUser = null;
    commonAppService.ValueMap = {
      'hero' : 'A',
      'tiny_grass' : 'C',
      'potion' : 'D',
      'wall' : 'E',
      'water' : 'F',
      'stone' : 'G',
      'wall_top' : 'H',
      'door_open' : 'I',
      'door_close' : 'J',
      'down_stairs' : 'K',
      'up_stairs' : 'L',
      'big_grass' : 'M'
    };


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