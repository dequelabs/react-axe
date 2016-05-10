module.exports = function(grunt) {
	'use strict';
	// Do grunt-related things in here
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-browserify');

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		babel: {
			options: {
				presets: ['react', 'es2015']
			},
			dist: {
				files: {
					'build/app.js': 'src/example.js'
				}
			}
		},
		browserify: {
			dist: {
				files: {
					'dist/bundle.js': ['build/*.js']
				}
			}
		}
	});

	grunt.registerTask('default', ['babel', 'browserify']);
};
