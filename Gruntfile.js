module.exports = function(grunt) {

	var appConfig = {
		src: 'app/web-src',
		dest: 'app/web'
	};


	// Project configuration.
	grunt.initConfig({
		appConfig: appConfig,
		pkg: grunt.file.readJSON('package.json'),

		// Setup the watcher.
		watch: {
			files: ["<%= appConfig.src %>/**/*"],
			tasks: ['sass', 'concat', 'cssmin', 'copy', 'usemin'],
		},

		sass: {
				dist: { files: {"<%= appConfig.src %>/css/style.css" : "<%= appConfig.src %>/sass/style.scss"} }
		},

		// Concatenate all the js files.
		concat: {
			options: {
				separator: ";"
			},
			dist: {
				src: ['<%= appConfig.src %>/scripts/**/*.js', '<%= appConfig.src %>/views/**/*.js'],
				dest: '<%= appConfig.dest %>/scripts.js'
			}
		},

		// Minimize the js files.
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				files: {
					'<%= appConfig.dest %>/<%= pkg.name %>.js': ['<%= concat.dist.dest %>']
				}
			}
		},

		cssmin: {
			 minify: {
    		expand: true,
    		cwd: '<%= appConfig.src %>/css',
    		src: ['*.css', '!*.min.css'],
    		dest: '<%= appConfig.dest %>/',
    		ext: '.css'
  		}
		},

		copy: {
			main: {
				files: [
					{expand: true, flatten: true, src: ['<%= appConfig.src %>/*.html'], dest: '<%= appConfig.dest %>/', filter: 'isFile'},
					{expand: true, cwd: "<%= appConfig.src %>", src: ['views/**/*.html'], dest: '<%= appConfig.dest %>/', filter: 'isFile'},
					{expand: true, flatten: true, src: ['<%= appConfig.src %>/audio/*'], dest: '<%= appConfig.dest %>/audio/', filter: 'isFile'},
					{expand: true, flatten: true, src: ['<%= appConfig.src %>/images/*'], dest: '<%= appConfig.dest %>/images/', filter: 'isFile'},
				]
			}
		},

		useminPrepare: {
			html: '<%= appConfig.dest %>/index.html'
		},

		usemin: {
			html: ['<%= appConfig.dest %>/*.html'],
			css: ['<%= appConfig.dest %>/*.css'],
			options: {
				dirs: ['<%= appConfig.dest %>']
			}
		},

		// Run QUnit
		qunit: {
			files: ['webfront/**/*.html']
		},

		// Run JSHint
		jshint: {
			files: ['Gruntfile.js', 'app/web-src/scripts/**/*.js'],
			options: {
				globals: {
					jQuery: true,
					console: true,
					module: true
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-qunit');	
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-sass');

	// Default task(s).
	grunt.registerTask('test', ['jshint', 'qunit']);
	grunt.registerTask('default', ['sass', 'concat', 'cssmin', 'copy', 'usemin']);

	grunt.event.on('watch', function(action, filepath, target) {
  	grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
	});
};