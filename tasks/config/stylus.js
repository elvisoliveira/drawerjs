/**
 * Grunt Stylus Task Configuration
 */

module.exports = {
	compile: {
		files: {
			"./public/css/styles.min.css": ["./public/styl/styles.styl"],
		}
	}
};