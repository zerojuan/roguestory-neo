'use strict';

// Demonstrate how to register services
angular.module('myApp.services').
	factory('AppRegistry', ['$rootScope', function($rootScope){
		var AppRegistry = {};

		AppRegistry.map = null;
		AppRegistry.playerPosition = {
			x: 0,
			y: 0
		};
		AppRegistry.loggedInUser = null;
		AppRegistry.ValueMap = {
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

		AppRegistry.moveList = [];
		AppRegistry.moveIndex = 0;


		AppRegistry.prepForBroadcast = function(property, msg){
			console.log('Saving Property: ', property, msg);
			this[property] = msg;
			this.broadcastItem(property);
		}

		AppRegistry.broadcastItem = function(property){
			$rootScope.$broadcast('handleBroadcast['+property+']');
		}

		return AppRegistry;
	}]);