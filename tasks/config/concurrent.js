/**
 * Grunt Concurrent Task Configuration
 */

module.exports = {
	observe: {
		options: {
			logConcurrentOutput: true
		},
		tasks: ["nodemon:server", "watch:stylus"]
	}
};