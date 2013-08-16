

angular.module("myApp.directives")
	.directive('onKeyup', function(){
		console.log('on keyup is here');
		return {
			restrict: 'A',
			link: function(scope, elm, attrs){
				elm.bind('keyup', function(evt){
					var move = {
						type: 'action'
					};
					switch(evt.which){
						case 90: 'z'
							move.data = 'sleep';
							break;
						default:
							return;
					}
					scope.$emit('onKeyEvent', move);
				});

				elm.bind('click', function(evt){
					console.log("I am clicking this yo");
				})
			}
		};
	});