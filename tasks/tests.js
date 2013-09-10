/**
 * Register Grunt Tests Tasks
 */

module.exports = function (grunt) {
	grunt.registerTask("lint", ["jshint:static", "jshint:server"]);
	grunt.registerTask("test", ["lint", "karma:single"]);
};