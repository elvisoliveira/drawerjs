/**
 * Controllers
 */

var path = require("path"),
	fs = require("fs");

var controllers = {},
	walk = function(location, object) {
	
		var dir = fs.readdirSync(location),
			i = dir.length - 1;

		while (i >= 0) {

			var name = dir[i],
				target = path.resolve(__dirname, location, name);

			var stats = fs.statSync(target);

			if (stats.isFile()) {
				if (name.slice(-3) === ".js") object[name.slice(0, -3)] = require(target);
			} else if (stats.isDirectory()) {
				object[name] = {};
				walk(target, object[name]);
			}

			i--;
		}
	};

walk(path.resolve(__dirname, "./"), controllers);

var key,
	keys = Object.keys(controllers),
	i = keys.length - 1;

while (i >= 0) {

	key = keys[i];
	if (Object.keys(controllers[key]).length === 0) delete controllers[key];

	i--;
}

module.exports = controllers;