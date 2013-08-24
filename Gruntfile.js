/**
 * Grunt Tasks Configuration
 */

module.exports = function (grunt) {


	/**
	 * Task Configuration
	 */

	grunt.config.init({


		/**
		 * JSHint | Static & Server JavaScript Files
		 */
		
		jshint: {
			
			options: {
				force: false,
				jshintrc: ".jshintrc"
			},

			static: ["drawer.js", "*.drawer.js"],

			server: [

				"*.js",
				"*.json",
				"!drawer.js",
				"!*.drawer.js"
			]
		}
	});


	/**
	 * Load NPM Plugins
	 */

	grunt.loadNpmTasks("grunt-contrib-jshint");
	

	/**
	 * Register Tasks
	 */
	
	grunt.registerTask("lint", [
		"jshint:static",
		"jshint:server"
	]);

	grunt.registerTask("test", ["lint"]);
	grunt.registerTask("default", ["test"]);
};