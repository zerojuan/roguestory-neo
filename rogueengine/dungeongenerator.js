(function(module){
	var ValueMap = require('./valuemap');

	module.exports = {
		generateDungeon : function(size, level){
			var map = [];
			var rows = size.height; //38;
			var cols = size.width; //80;
			for(var y = 0; y < rows; y++){
				map[y] = [];
				for(var x = 0; x < cols; x++){
					var val = 65 + (Math.round((Math.random() * ((70 - 65) + 1))));						
					map[y][x] = {
						val : ValueMap['hero'],
						ga : Math.random(),
						tint : {
							r : Math.round(Math.random()*255),
							g : Math.round(Math.random()*255),
							b : Math.round(Math.random()*255),
							t : 0.6
						}
					}					
				}
			}
			return map;
		}
	}

}(typeof module === 'undefined' ? this.rogueEngine = {} : module));