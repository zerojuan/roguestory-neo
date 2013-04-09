'use strict';

/* Directives */


angular.module('myApp.directives', ['http-auth-interceptor']).
  directive('game', [function(){
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


  			function tick(evt){
  				console.log("Ticking...");
  				
  				stage.update(event);
  			}
  		}
  	}
  }]);