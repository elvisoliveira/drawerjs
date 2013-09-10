/**
 * Test API Controller
 */

exports.test = function (request, response) {
	
	return response.json({
		name : "Roland"
	});
};