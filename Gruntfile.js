module.exports = function(grunt){
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean : {
			prod : ["client-prod/"]
		},
		copy : {
			prod : {
				files : [
					{expand: true, flatten: true, cwd: 'app/css/', src: ['*.css'], dest: 'client-prod/css/', filter: 'isFile'}, // includes files in path
	  		      	{expand: true, flatten: false, cwd: 'app/img/', src: ['**'], dest: 'client-prod/img/'}, // includes files in path and its subdirs
	  		      	{expand: true, flatten: true, cwd: 'app/data/', src: ['**'], dest: 'client-prod/data/'}, // includes files in path and its subdirs
	  		      	{expand: true, flatten: true, cwd: 'app/fonts/', src: ['**'], dest: 'client-prod/fonts/'},
	  		      	{expand: true, flatten: true, cwd: 'app/partials/', src: ['**'], dest: 'client-prod/partials/'} // includes files in path and its subdirs
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
					'app/lib/easel-0.6.js',
					'app/lib/preloadjs-0.3.js',
					'app/lib/tween-0.4.js',
					'app/lib/http-auth-interceptor.js',
					'app/js/game/base-board.js',
					'app/js/app.js',
					'app/js/services.js',
					'app/js/controllers/home.js',
					'app/js/controllers/login.js',
					'app/js/filters.js',
					'app/js/directives/game.js'					
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