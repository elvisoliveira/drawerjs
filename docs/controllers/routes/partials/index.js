/**
 * Partials Route Controller
 */

exports.partials = function (request, response) {
	return response.render("partials/" + request.params.name);
};