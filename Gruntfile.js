/**
 * Grunt Tasks Configuration
 */

module.exports = function (grunt) {

	var config = {
			package: grunt.file.readJSON("package.json"),
			env: process.env
		},
		glob = require("glob"),
		options = function (path) {

			var key,
				object = {};

			glob.sync("*", { cwd: path }).forEach(function (option) {
				key = option.replace(/\.js$/, "");
				object[key] = require(path + option);
			});

			return object;
		};

	grunt.config.init(grunt.util._.extend(config, options("./tasks/options/")));
	require("load-grunt-tasks")(grunt);
	grunt.loadTasks("tasks");
};