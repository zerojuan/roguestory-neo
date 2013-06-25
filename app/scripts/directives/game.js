
(function(){
  'use strict';

  var GameModel = (function(){
    var assetManifest = [
      {src : 'img/tileset.png', id: 'tileset'}
    ];
    function PrivateGameModel(opts){
			console.log("HEY I AM THE PRIVATE GAME MODEL");
      var that = this;
      this.canvas = opts.canvas;
      this.stage = new createjs.Stage(this.canvas);

			//===== Create Input Listeners =======/
      this.stage.onMouseUp = function(evt){
        that.handleMouseUp(evt);
      }

      this.stage.onMouseMove = function(evt){
        that.handleMouseMove(evt);
      }

      this.stage.onMouseDown = function(evt){
        that.handleMouseDown(evt);
      }
			//=====================================/

			//Graphical offset of the tilemap render
      this.offset = {
        x: 13,
        y: 19
      }

      this.base = opts.base;
      this.map = opts.map;
      this.assets = [];

      console.log("Initializing Window: "+ window.innerWidth + ", " + window.innerHeight);
      this.canvas.height = window.innerHeight;
      this.canvas.width = window.innerWidth;    

      var tileDownG = new createjs.Graphics();
      tileDownG.beginFill('#cc0');
      tileDownG.drawRect(0, 0, 13, 19);
      tileDownG.endFill();

			this.previousPosition = {
				row: 0,
				col: 0
			};

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
        console.log("Complete Loader:", that.assets);
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
        that.pathLayer = new opts.PathUI({
					tileSize: that.offset
				});
        that.base.x = that.offset.x;
        that.base.y = that.offset.y;
        that.stage.addChild(that.base, that.pathLayer.graphics, that.tileDown);
      }

      this.loader.loadManifest(assetManifest);

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

				if(this.isInBoundary(col, row+1)){
					this.tileDown.x = col * 13 + this.offset.x;
					this.tileDown.y = row * 19 + this.offset.y;
					this.tileDown.alpha = .6;

					if(col != this.previousPosition.col
						|| row + 1 != this.previousPosition.row){
						this.onHoverMapChanged(col, row+1);
						this.previousPosition.col = col;
						this.previousPosition.row = row + 1;
					}
				}else{
					//TODO: Add alternate mouse UI when hovering to the sidebar
					this.tileDown.alpha = 0;
				}


        //createjs.Tween.get(this.tileDown, {override: true}).to({alpha: .6}, 500);
      } 

      this.handleMouseUp = function(evt){
        var mouseX = evt.rawX - this.offset.x;
        var mouseY = evt.rawY - this.offset.y;

        this.tileDown.alpha = .6;


        var col = Math.floor(mouseX / 13);
        var row = Math.floor(mouseY / 19);

				if(this.isInBoundary(col, row + 1)){
					this.onClickedOnMap(col, row + 1);
					createjs.Tween.get(this.tileDown, {override: true}).to({alpha: 0}, 500);
				}else{
					this.tileDown.alpha = 0;
				}

      }

      this.updateMap = function(map){
        this.map = map;
        console.log("Updating map");
        if(this.base){
          this.base.updateMap(map);  
        }
        
      }

			this.doMove = function(newValue, oldValue){

				this.map[newValue.row][newValue.col].object = {
					material: "HERO_NORMAL",
					pulse: NaN,
					val: "A"
				};

				this.map[oldValue.row][oldValue.col].object = null;

			}

			this.renderPath = function(moveList){
				if(this.pathLayer){
					this.pathLayer.activate(moveList);
				}

			}

			this.isInBoundary = function(col, row){
				var mapRows = this.map.length;
				var mapCols = this.map[0].length;

				if(row < 0 || row > mapRows-1){
					return false;
				}

				if(col < 0 || col > mapCols-1){
					return false;
				}

				return true;
			}

      createjs.Ticker.addEventListener("tick", this.tick);
     
    }

    return PrivateGameModel;
  }());

  angular.module('myApp.directives').
  directive('game', ['BaseBoard', 'PathUI', 'AppRegistry', function(BaseBoard, PathUI, AppRegistry){
    return {
      restrict: 'E',
      transclude : true,
      replace: true,
      template : '<canvas ng-transclude>Test'+
      '</canvas>',
      scope : {
        "map" : "=map",
				"playerPosition" : "=playerPosition"
      },
      link : function(scope, elm, attrs){

        var _m = new GameModel({
          canvas: elm[0],
          map: scope.map,
          BaseBoard: BaseBoard,
          PathUI: PathUI
        });

        _m.onClickedOnMap = function(x, y){
          scope.$emit('onClickedOnMap', x, y);
        }

				_m.onHoverMapChanged = function(x, y){
					scope.$emit('onMouseOverMapChanged', x, y);
				}

				scope.$on('handleBroadcast[moveList]', function(){
					//console.log("It's working here, ", AppRegistry.moveList);
					_m.renderPath(AppRegistry.moveList);
				});

				scope.$watch('playerPosition', function(newValue, oldValue){
					console.log("New Value: ", newValue);
					console.log("Old Value: ", oldValue);
					_m.doMove(newValue, oldValue);
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

