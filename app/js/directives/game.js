
(function(){
  'use strict';

  var GameModel = (function(){
    var assetManifest = [
      {src : 'img/tileset.png', id: 'tileset'}
    ];
    function PrivateGameModel(opts){
      var that = this;
      this.canvas = opts.canvas;
      this.stage = new createjs.Stage(this.canvas);
      this.base = opts.base;
      this.map = opts.map;
      this.assets = [];
      console.log(window.innerHeight, window.innerWidth);
      this.canvas.height = window.innerHeight;
      this.canvas.width = window.innerWidth;    

      this.loader = new createjs.LoadQueue(false);
      this.loader.useXHR = false;
      this.loader.onFileLoad = function(evt){
        that.assets.push(evt);
      }
      this.loader.onComplete = function(evt){
        console.log("Complete", that.assets);
        for(var i = 0; i < that.assets.length; i++){
          var item = that.assets[i].item;
          var id = item.id;
          var result = that.assets[i].result;

          if(item.type == createjs.PreloadJS.IMAGE){
            var bmp = new createjs.Bitmap(result);
          }          
          switch(id){
            case 'tileset' : 
              console.log("Initialize?");              
              that.base = new opts.BaseBoard({tileSheet : result, map : that.map});
              break;
          }
        }

        that.stage.addChild(that.base);
      }

      this.loader.loadManifest(assetManifest);

      this.tick = function(evt){
        that.stage.update(event);
      }  

      this.updateMap = function(map){
        this.map = map;
        console.log("Updating map");
        if(this.base){
          this.base.updateMap(map);  
        }
        
      }

      createjs.Ticker.addEventListener("tick", this.tick);
     
    }

    return PrivateGameModel;
  }());

  angular.module('myApp.directives', ['myApp.gameModule','http-auth-interceptor']).
  directive('game', ['BaseBoard', function(BaseBoard){
    return {
      restrict: 'E',
      transclude : true,
      replace: true,
      template : '<canvas ng-transclude>Test'+
      '</canvas>',
      scope : {
        "map" : "=map"
      },
      link : function(scope, elm, attrs){

        var _m = new GameModel({
          canvas : elm[0],
          map : scope.map,
          BaseBoard : BaseBoard          
        });

        elm.width(window.innerWidth);
        elm.height(window.innerHeight);

        scope.$watch('map', function(newVal){
          _m.updateMap(newVal);
        });
      }
    }
  }]);

}())

