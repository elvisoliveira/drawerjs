/**
 * Register Grunt Observe Task
 */

module.exports = function (grunt) {
	grunt.registerTask("observe", ["concurrent:observe"]);
};