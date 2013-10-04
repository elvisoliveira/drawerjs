/**
 * Test API Controller
 */

var path = require("path"),
	flag = "api" + path.sep,
	index = __filename.indexOf(flag);

module.exports = {
	type: "GET",
	route: __filename.slice(index + flag.length, __filename.length).replace(".js", ""),
	handler: function (request, response) {
		return response.json({ name : "Roland" });
	}
};