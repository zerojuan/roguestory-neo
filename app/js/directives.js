'use strict';

/* Directives */


angular.module('myApp.directives', ['http-auth-interceptor']).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }]).
  directive('game', [function(version){
  	return {
  		restrict: 'E',
  		transclude : true,
  		replace: true,
  		template : '<canvas ng-transclude>Test'+
			'</canvas>',
  		link : function(scope, elm, attrs){  			
  			elm.width(window.innerWidth);
  			elm.height(window.innerHeight);
  			elm.addClass('stuff');
  			console.log(elm);
  			var canvas = elm[0];
  			canvas.height = window.innerHeight;
  			canvas.width = window.innerWidth;
  			var stage = new createjs.Stage(elm[0]);

  			createjs.Ticker.addEventListener("tick", tick);

  			var colors = ["#828b20", "#b0ac31", "#cbc53d", "#fad779", "#f9e4ad", "#faf2db", "#563512", "#9b4a0b", "#d36600", "#fe8a00", "#f9a71f"];
  			var rings = 30;
  			var circleRadius = 50;
			for (var i=0; i<200; i++) {
				var shape = new createjs.Shape();
				for (var j=rings; j>0; j--) {
					shape.graphics.beginFill(colors[Math.random()*colors.length |0]).drawCircle(0,0,circleRadius*j/rings);
				}
				shape.x = Math.random()*window.innerWidth;
				shape.y = Math.random()*window.innerHeight;
				shape.velX = Math.random()*10-5;
				shape.velY = Math.random()*10-5;

				// turn snapToPixel on for all shapes - it's set to false by default on Shape.
				// it won't do anything until stage.snapToPixelEnabled is set to true.
				shape.snapToPixel = true;

				stage.addChild(shape);
			}

  			function tick(evt){
  				console.log("Ticking...");
  				var w = canvas.width;
					var h = canvas.height;
					var l = stage.getNumChildren()-1;

					// iterate through all the children and move them according to their velocity:
					for (var i=1; i<l; i++) {
						var shape = stage.getChildAt(i);
						shape.x = (shape.x+shape.velX+w)%w;
						shape.y = (shape.y+shape.velY+h)%h;
					}
  				stage.update(event);
  			}
  		}
  	}
  }]);