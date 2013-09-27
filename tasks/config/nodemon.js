/**
 * Grunt Nodemon Task Configuration
 */

module.exports = {
	options: {
		env: {
			NODE_ENV: "development",
			PORT: 8080
		},
		watchedExtensions: ["js", "json", "jade"]
	},
	server: {}
};