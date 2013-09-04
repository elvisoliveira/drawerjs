/**
 * Grunt Tasks Configuration
 */

module.exports = function (grunt) {


	/**
	 * Task Configuration
	 */

	grunt.config.init({

		package: grunt.file.readJSON('package.json'),


		/**
		 * JSHint | Static & Server JavaScript Files
		 */
		
		jshint: {
			options: {
				jshintrc: ".jshintrc"
			},
			static: ["./src/drawer.js", "./src/jquery.drawer.js"],
			server: [

				"*.js",
				"*.json"
			]
		},


		/**
		 * Uglify | Minify Source Files
		 */

		uglify: {
			options: {
				banner:
					"/**\n" +
					" *\n" +
					" * <%= package.name %> <%= package.version %>\n" +
					" *\n" +
					" * <%= package.description %>\n" +
					" *\n" +
					" * Website: <%= package.homepage %>\n" +
					" * Repository: <%= package.repository.url %>\n" +
					" * Bugs: <%= package.bugs.url %>\n" +
					" *\n" +
					" * Copyright (c) " + grunt.template.today("yyyy") + " <%= package.author %>\n" +
					" * License <%= package.license.type %>: <%= package.license.url %> \n" +
					" *\n" +
					" */\n" + "\n\n"
			},
			drawer: {
				files: {
					"./dist/drawer.min.js": ["./src/drawer.js"]
				}
			},
			drawerjq: {
				files: {
					"./dist/jquery.drawer.min.js": ["./src/drawer.js", "/src/jquery.drawer.js"]
				}
			}
		}
	});


	/**
	 * Load NPM Plugins
	 */

	grunt.loadNpmTasks("grunt-contrib-jshint");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	

	/**
	 * Register Tasks
	 */
	
	grunt.registerTask("lint", [
		"jshint:static",
		"jshint:server"
	]);

	grunt.registerTask("build", [
		"uglify:drawer",
		"uglify:drawerjq"
	]);

	grunt.registerTask("test", ["lint"]);
	grunt.registerTask("default", ["test"]);
};