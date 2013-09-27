/**
 * Partial AMD Route Controller
 */

var flag = "routes" + require("path").sep,
	index = __filename.indexOf(flag);

module.exports = function (request, response) {
	return response.render(__filename.slice(index + flag.length, __filename.length).replace(".js", ""));
};