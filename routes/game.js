
var DungeonGenerator = require("../rogueengine/dungeongenerator");

exports.getDungeon = function(req, res, next){	
	var map = DungeonGenerator.generateDungeon({width: 80, height: 38});
	return res.send(map);
}