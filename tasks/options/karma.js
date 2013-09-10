/**
 * Grunt Karma Task Configuration
 */

module.exports = {
	continuous: {
		browsers: ["PhantomJS"]
	},
	options: {
		frameworks: ["mocha", "chai"],
		files: ["./test/polyfills.js", "./test/src/utils.js", "./test/**/*.js"],
		reporters: ["progress"],
		autoWatch: true,
		browsers: ["PhantomJS"],
	},
	single: {
		browsers: ["PhantomJS"],
		singleRun: true
	}
};