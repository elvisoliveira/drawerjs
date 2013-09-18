angular.module("docs", ["ngRoute", "ngAnimate", "docs.services", "docs.filters", "docs.directives", "docs.controllers"]).config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {

	var config = {
			index: {
				templateUrl : "partials/index",
				controller : "IndexCtrl"
			}
		};

	$routeProvider.when("/", config.index);
	$routeProvider.otherwise({ redirectTo : "/" });
	$locationProvider.html5Mode(true);
}]);

angular.module("docs.services", []);
angular.module("docs.filters", []);
angular.module("docs.directives", []);
angular.module("docs.controllers", []);