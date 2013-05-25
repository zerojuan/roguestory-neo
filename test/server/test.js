var assert = require('assert');
var GH = require('../../rogueengine/generatorhelper');
var generator = require('../../rogueengine/dungeongenerator');


suite('Dungeon Generator: Helper', function(){

	function createFreshMap(width, height){
		var dungeon = {
			width: width,
			height: height,
			rooms: [],
			hallways: []
		}
		return dungeon;
	}

	test('Orthogonal Adjacent', function(){
		assert.ok(GH.isAdjacentOrtho({x:0, y:0},{x:0,y:1}), 'valid ortho');
		assert.ok(!GH.isAdjacentOrtho({x:0, y:0},{x:1,y:1}), 'diagonal');
		assert.ok(!GH.isAdjacentOrtho({x:0, y:0},{x:2,y:0}), 'one space too far');
	});

	test('Test Dimension Capping', function(){		
		var dungeon = createFreshMap(20, 30);
		var width = GH.capWidth(0, 5, dungeon);
		var height = GH.capHeight(0, 5, dungeon);
		assert.ok(width == 5, 'less than width should not be capped');
		assert.ok(height == 5, 'less than height should not be capped');

		width = GH.capWidth(15, 5, dungeon);
		height = GH.capHeight(25, 5, dungeon);
		assert.ok(width == 4, 'should be capped (w)');
		assert.ok(height == 4, 'should be capped (h)');

		width = GH.capWidth(17, 5, dungeon);
		height = GH.capHeight(27, 5, dungeon);
		assert.ok(width == 2, 'should be capped (w2)');
		assert.ok(height == 2, 'should be capped (h2)');
	});

	test('Test Make Room', function(){
		var map = createFreshMap(20, 30);

		map.rooms = [];
		var room = GH.makeRoom(0, 0, 23, 23, map);
		assert.ok(room, 'should build a room');
		assert.ok(room.width == 19, 'should trim the width');
		map.rooms.push(room);



		room = GH.makeRoom(0, 0, 3, 3, map);
		assert.ok(!room, 'should not return a room, map is full');

		map.rooms = [];
		room = GH.makeRoom(0, 0, 2, 2, map);
		assert.ok(!room, 'should not make a room less than the minimum dimensions');
		room = GH.makeRoom(0, 0, 3, 3, map);
		assert.ok(room.width == 3 && room.height == 3, 'should make a room at minimum dimension');
		map.rooms.push(room);
		room = GH.makeRoom(3, 3, 4, 4, map);
		assert.ok(room.width == 4 && room.height == 4, 'should not overlap');
		map.rooms.push(room);
		room = GH.makeRoom(4, 4, 4, 4, map);
		assert.ok(!room, 'should overlap');
	});

	test('Test Entrance Designer', function(){
		var map = createFreshMap(20, 30);
		var rooms = [];

		var room = GH.designEntrance(2, 2, 5, 5, map);		
		assert.ok(room.entrance.x == 6 && room.entrance.y == 4, 'entrance default (E)');
		room = GH.designEntrance(2, 2, 5, 5, map, 'N');
		assert.ok(room.entrance.x == 4 && room.entrance.y == 2, 'entrance (N)');
		room = GH.designEntrance(2, 2, 5, 5, map, 'S');
		assert.ok(room.entrance.x == 4 && room.entrance.y == 6, 'entrance (S)');
		room = GH.designEntrance(2, 2, 5, 5, map, 'W');
		assert.ok(room.entrance.x == 2 && room.entrance.y == 4, 'entrance (W)');
	});

	test('Test Possible Doorway', function(){
		var dungeon = createFreshMap(7, 7);

		var entrance = GH.designEntrance(2, 2, 5, 5, dungeon);
		
		assert.ok(entrance.entrance.x == 5 && entrance.entrance.y == 4, 'entrance default(E)');
		var doorTry = GH.getPossibleDoorway(entrance, dungeon);
		assert.ok(!doorTry, 'Doorway shouldnt be possible near boundaries');

		dungeon = createFreshMap(20, 20);
		entrance = GH.designEntrance(2,2,5,5, dungeon);
		doorTry = GH.getPossibleDoorway(entrance, dungeon);
		assert.ok(!GH.isAdjacentOrtho(doorTry, entrance.entrance), 'should not be adjacent to entrance');

		entrance = GH.designEntrance(2, 2, 3, 3, dungeon);
		doorTry = GH.getPossibleDoorway(entrance, dungeon);
		assert.ok(!GH.isAdjacentOrtho(doorTry, entrance.entrance), 'should not be adjacent to entrance (2)');
		
	});

	test('Test Hallway Making', function(){
		var dungeon = createFreshMap(20, 20);

		var entrance = GH.designEntrance(2, 2, 5, 5, dungeon);		
		var doorTry = GH.getPossibleDoorway(entrance, dungeon);		
		assert.ok(doorTry, 'possible doorway, gotten');
		var hallway = GH.designHallway(entrance, doorTry, dungeon);		
		assert.ok(hallway && hallway.length > 3, 'hallway length must be greater than 3');		
	});
	
});

suite('Dungeon Generator: Main', function(){
	setup(function(){

	});

	test('test B', function(){

	});
});