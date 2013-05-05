
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

      this.stage.onMouseUp = function(evt){
        that.handleInput(evt);
      }

      this.stage.onMouseMove = function(evt){
        that.handleMouseMove(evt);
      }

      this.stage.onMouseDown = function(evt){
        that.handleMouseDown(evt);
      }

      this.offset = {
        x: 13,
        y: 19
      }

      this.base = opts.base;
      this.map = opts.map;
      this.assets = [];
      console.log(window.innerHeight, window.innerWidth);
      this.canvas.height = window.innerHeight;
      this.canvas.width = window.innerWidth;    

      var tileDownG = new createjs.Graphics();
      tileDownG.beginFill('#cc0');
      tileDownG.drawRect(0, 0, 13, 19);
      tileDownG.endFill();

      this.tileDown = new createjs.Shape(tileDownG);
      this.tileDown.alpha = 1;
      this.tileDown.x = -300;
      this.tileDown.y = -300;

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
        that.pathLayer = new opts.PathUI();
        that.base.x = that.offset.x;
        that.base.y = that.offset.y;
        that.stage.addChild(that.base, that.pathLayer.graphics, that.tileDown);
      }

      this.loader.loadManifest(assetManifest);
      //TODO: Create a layer for the mouse controller
      this.tick = function(evt){
        that.stage.update(event);
      }

      this.handleMouseDown = function(evt){
        var mouseX = evt.rawX - this.offset.x;
        var mouseY = evt.rawY - this.offset.y;

        //TODO: Add boundary checks

        var col = Math.floor(mouseX / 13);
        var row = Math.floor(mouseY / 19);

        this.tileDown.x = col * 13 + this.offset.x;
        this.tileDown.y = row * 19 + this.offset.y;
        this.tileDown.alpha = 0;
        //createjs.Tween.get(this.tileDown, {override: true}).to({alpha: .6}, 500);
      } 

      this.handleMouseMove = function(evt){
        var mouseX = evt.rawX - this.offset.x;
        var mouseY = evt.rawY - this.offset.y;

        var col = Math.floor(mouseX / 13);
        var row = Math.floor(mouseY / 19);

        this.tileDown.x = col * 13 + this.offset.x;
        this.tileDown.y = row * 19 + this.offset.y;
        this.tileDown.alpha = .6;
        //createjs.Tween.get(this.tileDown, {override: true}).to({alpha: .6}, 500);
      } 

      this.handleInput = function(evt){
        var mouseX = evt.rawX - this.offset.x;
        var mouseY = evt.rawY - this.offset.y;

        this.tileDown.alpha = .6;

        //TODO: Add boundary checks
        //TODO: Dispatch this tap to the world
        createjs.Tween.get(this.tileDown, {override: true}).to({alpha: 0}, 500);
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

  angular.module('myApp.directives').
  directive('game', ['BaseBoard', 'PathUI', function(BaseBoard, PathUI){
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
          canvas: elm[0],
          map: scope.map,
          BaseBoard: BaseBoard,
          PathUI: PathUI        
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

