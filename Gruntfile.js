module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean : {
			prod : ["client-prod/"]
		},
		copy : {
			prod : {
				files : [
					{expand: true, flatten: true, cwd: 'app/styles/', src: ['*.css'], dest: 'client-prod/styles/', filter: 'isFile'}, // includes files in path
	  		      	{expand: true, flatten: false, cwd: 'app/img/', src: ['**'], dest: 'client-prod/img/'}, // includes files in path and its subdirs	  		      	
	  		      	{expand: true, flatten: true, cwd: 'app/fonts/', src: ['**'], dest: 'client-prod/fonts/'},
	  		      	{expand: true, flatten: true, cwd: 'app/views/', src: ['**'], dest: 'client-prod/views/'} // includes files in path and its subdirs
				]
			}
		},
		jshint : {
			all : ['Gruntfile.js', 'client-prod/app.js']
		},
		uglify : {
			prod: {
				src : 'client-prod/app.js',
				dest : 'client-prod/app.min.js'
			}
		},
		targethtml : {
			prod : {
				files : {
					'client-prod/index.html' : 'app/index.html'
				}
			},
			pre : {
				files : {
					'client-prod/index.html' : 'app/index.html'
				}
			}
		},
		concat : {
			prod : {
				separator : ';',
				src : [					
					'app/scripts/vendors/http-auth-interceptor.js',					
					'app/scripts/app.js',
					'app/scripts/game/base-board.js',
					'app/scripts/game/path-ui.js',
					'app/scripts/game/dungeon-util.js',
					'app/scripts/services/appregistry.js',
					'app/scripts/controllers/home.js',
					'app/scripts/controllers/login.js',
					'app/scripts/controllers/dungeon.js',
					'app/scripts/filters.js',
					'app/scripts/directives/game.js'					
				],
				dest : 'client-prod/app.js'
			}
		}		
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-targethtml');

	grunt.registerTask('prod', ['clean:prod', 'concat:prod', 'uglify:prod', 'copy:prod', 'targethtml:prod']);
	grunt.registerTask('pre', ['clean:prod', 'concat:prod', 'copy:prod', 'targethtml:pre']);
};