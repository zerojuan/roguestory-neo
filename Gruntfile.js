var path = require('path');

module.exports = function(grunt){
	require('load-grunt-tasks')(grunt);
	require('time-grunt')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		yeoman: {
			app: require('./bower.json').appPath || 'app',
			dist: 'dist'
		},
		clean : {
			prod : ["<%= yeoman.dist %>/"],
			server: '.tmp'
		},
		watch: {
			styles: {
				files: ['<%= yeoman.app %>/styles/{,*/}*.css'],
				tasks: ['copy:styles', 'autoprefixer']
			},
			livereload: {
				options: {
					livereload: '<%= express.livereload.options %>'
				},
				files: [
					'<%= yeoman.app %>/{,*/}*.html',
			        '.tmp/styles/{,*/}*.css',
			        '{.tmp,<%= yeoman.app %>}/scripts/{,*/}*.js',
			        '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
				]
			}
		},
		express: {
			options: {
				port: 9000,
				hostname: 'localhost'
			},
			livereload: {
				options: {
					server: path.resolve('./app.js'),
					livereload: true,
					serverreload: true
				}
			}
		},
		open: {
			server: {
				url: 'http://localhost:<%= express.options.port %>'
			}
		},
		autoprefixer: {
			options: ['last 1 version'],
			dist: {
				files: [{
					expand: true,
					cwd: '.tmp/styles/',
					src: '{,*/}*.css',
					dest: '.tmp/styles/'
				}]
			}
		},
		copy : {
			prod : {
				files : [
					{expand: true, flatten: true, cwd: 'app/styles/', src: ['*.css'], dest: '<%= yeoman.dist %>/styles/', filter: 'isFile'}, // includes files in path
	  		      	{expand: true, flatten: false, cwd: 'app/img/', src: ['**'], dest: '<%= yeoman.dist %>/img/'}, // includes files in path and its subdirs	  		      	
	  		      	{expand: true, flatten: true, cwd: 'app/fonts/', src: ['**'], dest: '<%= yeoman.dist %>/fonts/'},
	  		      	{expand: true, flatten: true, cwd: 'app/views/', src: ['**'], dest: '<%= yeoman.dist %>/views/'} // includes files in path and its subdirs
				]
			},
			styles: {
				expand: true,
				cwd: '<%= yeoman.app %>/styles',
				dest: '.tmp/styles/',
				src: '{,*/}*.css'
			}
		},
		jshint : {
			all : ['Gruntfile.js', '<%= yeoman.dist %>/app.js']
		},
		uglify : {
			prod: {
				src : '<%= yeoman.dist %>/app.js',
				dest : '<%= yeoman.dist %>/app.min.js'
			}
		},
		targethtml : {
			prod : {
				files : {
					'<%= yeoman.dist %>/index.html' : 'app/index.html'
				}
			},
			pre : {
				files : {
					'<%= yeoman.dist %>/index.html' : 'app/index.html'
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
				dest : '<%= yeoman.dist %>/app.js'
			}
		}		
	});

	grunt.registerTask('server', function(target){
		if(target === 'dist'){
			//return grunt.task.run(['build', 'open', 'express:dist:keepalive'])
			return;
		}

		grunt.task.run([
			'clean:server',
			//'concurrent:server',
			'express:livereload',			
			'watch',
			'open'
		]);
	})

	grunt.registerTask('prod', ['clean:prod', 'concat:prod', 'uglify:prod', 'copy:prod', 'targethtml:prod']);
	grunt.registerTask('pre', ['clean:prod', 'concat:prod', 'copy:prod', 'targethtml:pre']);
};