(function(){
	'use strict';

	angular.module('myApp.gameModule')
		.factory('LineOfSight', ['DungeonUtil', function(DungeonUtil){
			var LineOfSight = {};

			var calculateLine = function(start, end){
				var points = [];
				var x0 = start.col;
				var y0 = start.row;
				var x1 = end.col;
				var y1 = end.row;

				var dx = Math.abs(x1 - x0);
				var dy = Math.abs(y1 - y0);

				var sx = x0 < x1 ? 1 : -1;
				var sy = y0 < y1 ? 1 : -1;
				var err = dx - dy;

				while(true){
					points.push({
						row: y0,
						col: x0
					});

					if(x0 == x1 && y0 == y1)
						break;

					var e2 = err * 2;
					if(e2 > -dx){
						err -= dy;
						x0 += sx;
					}
					if(e2 < dx){
						err += dx;
						y0 += sy;
					}
				}

				return points;
			}

			var canSee = function(start, end, visionRadius, map){
				var wx = end.col;
				var wy = end.row;

				var x = start.col;
				var y = start.row;

				if(((x-wx)*(x-wx))+((y-wy)*(y-wy)) > visionRadius * visionRadius)
					return false;

				var line = calculateLine(start, end);
				for(var i = 0; i < line.length; i++){
					var point = line[i];
					if(DungeonUtil.isGround(point, map) || point.row == wy && point.col == wx)
						continue;

					return false;
				}

				return true;
			}



			LineOfSight.doLOS = function(playerPos, visionRadius, map){
				if(!playerPos){
					return;
				}

				console.log("Doing los");

				//grayout everything
				for(var i = 0; i < map.length; i++){
					for(var j = 0; j < map[i].length; j++){
						if(map[i][j].visibility === 1){
							map[i][j].visibility = .5;
						}

						var point = {
							row: i,
							col: j
						};

						if(canSee(playerPos, point, visionRadius, map)){
							map[i][j].visibility = 1;
						}
					}
				}
			}

			return LineOfSight;
		}])
}());