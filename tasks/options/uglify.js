/**
 * Grunt Uglify Task Configuration
 */

module.exports = {
	options: {
		banner:
			"/**\n *\n * <%= package.name %> <%= package.version %>\n *\n * <%= package.description %>\n *\n * Website: <%= package.homepage %>\n * Repository: <%= package.repository.url %>\n * Bugs: <%= package.bugs.url %>\n *\n * Copyright (c) 2013 <%= package.author %>\n * License <%= package.license.type %>: <%= package.license.url %> \n *\n */\n\n\n"
	},
	drawer: {
		files: {
			"./dist/drawer.min.js": ["./src/drawer.js"],
			"./dist/jquery.drawer.min.js": ["./src/drawer.js", "./src/jquery.drawer.js"]
		}
	}
};