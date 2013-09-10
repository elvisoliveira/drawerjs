/**
 * Register Grunt Build Task
 */

module.exports = function (grunt) {
	grunt.registerTask("build", ["test", "uglify"]);
};