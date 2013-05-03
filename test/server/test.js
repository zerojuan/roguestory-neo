var assert = require('assert');
var GH = require('../../rogueengine/generatorhelper');
var generator = require('../../rogueengine/dungeongenerator');


suite('Dungeon Generator: Helper', function(){

	function createFreshMap(width, height){
		var map = [];
		for(var row = 0; row < height; row++){
			map[row] = [];
			for(var col = 0; col < width; col++){
				map[row][col] = {
					val: '0'
				}
			}
		}
		return map;
	}

	test('Test Dimension Capping', function(){		
		var map = createFreshMap(20, 30);
		var width = GH.capWidth(0, 5, map);
		var height = GH.capHeight(0, 5, map);
		assert.ok(width == 5, 'less than width should not be capped');
		assert.ok(height == 5, 'less than height should not be capped');

		width = GH.capWidth(15, 5, map);
		height = GH.capHeight(25, 5, map);
		assert.ok(width == 4, 'should be capped (w)');
		assert.ok(height == 4, 'should be capped (h)');

		width = GH.capWidth(17, 5, map);
		height = GH.capHeight(27, 5, map);
		assert.ok(width == 2, 'should be capped (w2)');
		assert.ok(height == 2, 'should be capped (h2)');
	});

	test('Test Make Room', function(){
		var map = createFreshMap(20, 30);

		var rooms = [];
		var room = GH.makeRoom(0, 0, 23, 23, map);
		assert.ok(room, 'should build a room');
		assert.ok(room.width == 19, 'should trim the width');
		rooms.push(room);

		room = GH.makeRoom(0, 0, 3, 3, map, rooms);
		assert.ok(!room, 'should not return a room, map is full');

		rooms = [];
		room = GH.makeRoom(0, 0, 2, 2, map);
		assert.ok(!room, 'should not make a room less than the minimum dimensions');
		room = GH.makeRoom(0, 0, 3, 3, map);
		assert.ok(room.width == 3 && room.height == 3, 'should make a room at minimum dimension');
		rooms.push(room);
		room = GH.makeRoom(3, 3, 4, 4, map, rooms);
		assert.ok(room.width == 4 && room.height == 4, 'should not overlap');
		rooms.push(room);
		room = GH.makeRoom(4, 4, 4, 4, map, rooms);
		assert.ok(!room, 'should overlap');
	});

	test('Test Entrance Designer', function(){
		var map = createFreshMap(20, 30);
		var rooms = [];

		var room = GH.designEntrance(2, 2, 5, 5, map);		
		assert.ok(room.entrance.x == 7 && room.entrance.y == 4, 'entrance default (E)');
		room = GH.designEntrance(2, 2, 5, 5, map, 'N');
		assert.ok(room.entrance.x == 4 && room.entrance.y == 2, 'entrance (N)');
		room = GH.designEntrance(2, 2, 5, 5, map, 'S');
		assert.ok(room.entrance.x == 4 && room.entrance.y == 7, 'entrance (S)');
		room = GH.designEntrance(2, 2, 5, 5, map, 'W');
		assert.ok(room.entrance.x == 2 && room.entrance.y == 4, 'entrance (W)');
	});

	test('')
});

suite('Dungeon Generator: Main', function(){
	setup(function(){

	});

	test('test B', function(){

	});
});