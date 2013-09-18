/**
 * Grunt JSHint Task Configuration
 */

module.exports = {
	options: {
		jshintrc: ".jshintrc"
	},
	drawer: ["./src/drawer.js", "./src/jquery.drawer.js"],
	static: ["./public/**/*.js"],
	server: ["*.js", "*.json", "./tasks/**/*.js", "./docs/**/*.js"]
};