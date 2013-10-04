/**
 * Partial AMD Route Controller
 */

var path = require("path"),
	flag = "routes" + require("path").sep,
	index = __filename.indexOf(flag),
	route = __filename.slice(index + flag.length, __filename.length).replace(".js", "");

module.exports = {
	type: "GET",
	route: route,
	handler: function (request, response) {
		return response.render(route);
	}
};