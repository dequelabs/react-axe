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
				files: [
					{src: 'src/example.js', dest: 'build/example.js'},
					{src: 'src/globalHeader.js', dest: 'build/globalHeader.js'},
					{src: 'src/service.js', dest: 'build/service.js'},
					{src: 'src/serviceChooser.js', dest: 'build/serviceChooser.js'}
				]
			}
		},
		browserify: {
			dist: {
				files: {
					'dist/bundle.js': ['build/example.js']
				}
			},
			options: {
				transform: ['envify']
			}
		}
	});

	grunt.registerTask('default', ['babel', 'browserify']);
};
