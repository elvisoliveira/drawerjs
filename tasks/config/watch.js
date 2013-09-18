/**
 * Grunt Watch Task Configuration
 */

module.exports = {
	stylus: {
		files: ["./public/styl/*.styl"],
		tasks: ["stylus:compile"]
	}
};