/**
 * Grunt Tasks Configuration
 */

module.exports = function (grunt) {

	var config = {
			package: grunt.file.readJSON("package.json")
		},
		glob = require("glob"),
		options = function (path) {

			var key,
				object = {},
				filter = function (option) {
					key = option.replace(/\.js$/, "");
					object[key] = require(path + option);
				};

			glob.sync("*", { cwd: path }).forEach(filter);

			return object;
		};

	grunt.config.init(grunt.util._.extend(config, options("./tasks/config/")));
	require("load-grunt-tasks")(grunt);
	grunt.loadTasks("tasks");
};