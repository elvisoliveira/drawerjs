/**
 * Grunt Recess Task Configuration
 */

module.exports = {
	options: {
		compile: true,
		compress: true
	},
	compile: {
		files: {
			"./public/css/styles.min.css": ["./public/less/styles.less"],
		}
	}
};