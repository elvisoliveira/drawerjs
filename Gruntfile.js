/**
 * Grunt Tasks Configuration
 */

module.exports = function (grunt) {


	/**
	 * Task Configuration
	 */

	grunt.config.init({


		/**
		 * Bower Install Components
		 */

		bower: {

			options: {

				targetDir: "./public/"
			},

			install: {}
		},


		/**
		 * Concurrent | Nodemon & Watch
		 */

		concurrent: {
		
			observe: {
		
				tasks: [

					"nodemon:development-server"
				],
		
				options: {
			
					logConcurrentOutput: true
				}
			}
		},


		/**
		 * JSHint | Static & Server JavaScript Files
		 */
		
		jshint: {
			
			options: {

				force: true,
				jshintrc: ".jshintrc"
			},

			drawerjs: [

				"drawerjs.js",
				"*.drawerjs.js"
			],

			static: ["./public/js/**/*.js"],

			server: [

				"*.js",
				"*.json",
				"./docs/**/*.js",
				"!drawerjs.js",
				"!*.drawerjs.js"
			]
		},


		/**
		 * Nodemon | Server Livereload
		 */
		
		nodemon: {
			
			"development-server": {
				
				options: {
					
					env: {

						NODE_ENV: "development",
						PORT: 8080
					},

					watchedExtensions: [
						
						"js",
						"json"
					]
				}
			}
		}
	});


	/**
	 * Load NPM Plugins
	 */

	grunt.loadNpmTasks("grunt-concurrent");
	grunt.loadNpmTasks("grunt-nodemon");
	grunt.loadNpmTasks("grunt-bower-task");
	grunt.loadNpmTasks("grunt-contrib-jshint");
	

	/**
	 * Register Tasks
	 */
	
	grunt.registerTask("lint", [

		"jshint:drawerjs",
		"jshint:static",
		"jshint:server"
	]);

	grunt.registerTask("observe", ["concurrent:observe"]);
	grunt.registerTask("test", ["lint"]);

	grunt.registerTask("default", [""]);
};