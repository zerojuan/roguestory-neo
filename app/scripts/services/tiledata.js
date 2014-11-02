'use strict';


angular.module('rs.services')
	.service('TileDataService', [function(){

	var TileDataService = {};

	TileDataService.getDesc = function(tile){
		return "Stuff: " + tile.val + " Made of: " + tile.material;
	}

	return TileDataService;

}]);