/**
 * Grunt JSHint Task Configuration
 */

module.exports = {
	options: {
		jshintrc: ".jshintrc"
	},
	static: ["./src/drawer.js", "./src/jquery.drawer.js"],
	server: [

		"*.js",
		"*.json",
		"./tasks/**/*.js"
	]
};