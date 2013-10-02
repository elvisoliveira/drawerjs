/**
 * Index Route Controller
 */

var path = require("path"),
	config = require(path.resolve(process.cwd(), "config.js")),
	flag = "routes" + path.sep,
	index = __filename.indexOf(flag);

module.exports =  function (request, response) {
	response.locals = config;
	return response.render(__filename.slice(index + flag.length, __filename.length).replace(".js", ""));
};