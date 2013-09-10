/**
 * Routes Controller
 */

var path = require("path"),
	fs = require("fs"),	
	files = fs.readdirSync(path.resolve(__dirname)).filter(function (file) {
		return file !== path.basename(__filename);
	}),
	routes = {};

var file, key
	i = files.length - 1;

while (i >= 0) {

	file = require(path.resolve(__dirname, files[i]));
	key = Object.keys(file)[0];
	routes[key] = file[key];

	i--;
}


/**
 * Export Routes Object
 */

module.exports = routes;