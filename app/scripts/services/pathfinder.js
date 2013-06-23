'use strict';

angular.module('myApp.services').
	factory('PathFinder', ['$rootScope', function($rootScope){
		var PathFinder = {};

		//TODO: Test dumb pathfinding
		PathFinder.findPath = function(start, end, map){
			//loop from start to end key
			var currBlock = {
				row: start.row,
				col: start.col
			}
			var path = [];

			while(currBlock.row != end.row || currBlock.col != end.col){
				path.push({
					row: currBlock.row,
					col: currBlock.col
				});
				if(currBlock.row > end.row){
					currBlock.row--;
				}else if(currBlock.row < end.row){
					currBlock.row++;
				}

				if(currBlock.col > end.col){
					currBlock.col--;
				}else if(currBlock.col < end.col){
					currBlock.col++;
				}
			}
			//console.log(path[0]);

			//return an array of paths
			return path;
		}

		return PathFinder;
	}]);
