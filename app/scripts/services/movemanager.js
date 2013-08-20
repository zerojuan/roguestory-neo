'use strict';

angular.module('rs.services')
	.factory('MoveManager', ['$timeout', 'AppRegistry', 'LineOfSight', function($timeout, AppRegistry, LineOfSight){
		var MoveManager = {};

		var currIndex = 0;

		MoveManager.validateMove = function(move, map){
			//check if the move is valid
			switch(move.type){
				case 'action':
					if(move.data == 'sleep'){
						return true;
					}else{
						var data = move.data;
						var isAdjacent = Math.abs(AppRegistry.playerPosition.row - data.position.row) <= 1 &&
							Math.abs(AppRegistry.playerPosition.col - data.position.col) <= 1;
						switch(data.type){
							case 'door_open':
								return isAdjacent;
							case 'door_close':
								return isAdjacent;
						}
					}
					break;
				case 'movelist':
					break;
				case 'quickmove':
					break;
			}
		}


		MoveManager.executeMove = function(move, map){
			//check what kind of move?
			switch(move.type){
				case 'action':
					//check what type it is
					MoveManager.doAction(move, map);
					AppRegistry.updateTimeStep();
					break;
				case 'movelist':
					currIndex = 0;
					MoveManager.doMove();
					break;
				case 'quickmove':
					break;
			}
		}

		MoveManager.doAction = function(move, map){
			var data = move.data;
			switch(data.type){
				case 'door_open':
					map[data.position.row][data.position.col].val = AppRegistry.ValueMap['door_open'];
					map[data.position.row][data.position.col].solid = false;
					AppRegistry.prepForBroadcast('map', map);
					break;
				case 'door_close':
					map[data.position.row][data.position.col].val = AppRegistry.ValueMap['door_close'];
					map[data.position.row][data.position.col].solid = true;
					AppRegistry.prepForBroadcast('map', map);
					break;
			}
		}
		
		MoveManager.doMove = function(){
			var currMove = AppRegistry.moveList[currIndex];
			LineOfSight.doLOS(currMove, 5, AppRegistry.map);
			if(currMove && AppRegistry.playerIsMoving){ //a move exists
				AppRegistry.prepForBroadcast('playerPosition', currMove);
				AppRegistry.updateTimeStep();
				currIndex++;
				$timeout(MoveManager.doMove, 50);
			}else{
				AppRegistry.prepForBroadcast('moveList', null);
				AppRegistry.prepForBroadcast('playerIsMoving', false);
				return;
			}
		}

		return MoveManager;
	}]);