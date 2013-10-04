/**
 * Index Route Controller
 */

var path = require("path"),
	config = require(path.resolve(process.cwd(), "config.js")),
	flag = "routes" + path.sep,
	index = __filename.indexOf(flag),
	route = __filename.slice(index + flag.length, __filename.length).replace(".js", "");

module.exports = {
	type: "GET",
	route: route,
	handler: function (request, response) {
		response.locals = config;
		response.cookie("XSRF-TOKEN", request.csrfToken());
		return response.render(route);
	}
};