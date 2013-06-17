'use strict';

angular.module('myApp.services').
	factory('PathFinder', ['$rootScope', function($rootScope){
		var PathFinder = {};

		//TODO: Test dumb pathfinding
		PathFinder.findPath = function(start, end, map){
			//return an array of paths
			return [{
				row: start.row,
				col: start.col-1
			},{
				row: start.row,
				col: start.col-2
			},{
				row: start.row,
				col: start.col-3
			},{
				row: start.row,
				col: start.col-4
			}];
		}

		return PathFinder;
	}]);
