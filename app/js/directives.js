'use strict';

/* Directives */


angular.module('myApp.directives', ['http-auth-interceptor']).
  directive('appVersion', ['version', function(version) {
    return function(scope, elm, attrs) {
      elm.text(version);
    };
  }])
  .directive('loginTest',function(){
  	return {
  		restrict : 'C',
  		link : function(scope, elem, attrs){
  			elem.removeClass('waiting-for-angular');

  			var login = elem.find('#login-holder');
  			var main = elem.find('#content');

  			main.hide();

  			scope.$on('event:auth-loginRequired', function(){
  				login.slideDown('slow',function(){
  					main.hide();
  				});
  			});

  			scope.$on('event:auth-loginConfirmed', function(){
  				main.show();
  				login.slideUp();
  			});
  		}
  	}
  });
