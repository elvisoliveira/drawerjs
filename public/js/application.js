angular
	.module("Drawer", ["ngRoute", "Services", "Filters", "Directives", "Controllers"])
	.constant("Author", "Drawer")
	.value("version", "3.0.0")
	.config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {

		$routeProvider
			.when("/", {

				templateUrl : "partials/index",
				controller : "HomeTestCtrl"
			})
			.when("/test", {

				templateUrl : "partials/test",
				controller: "ContactTestCtrl"
			})
			.otherwise({
				redirectTo : "/"
			});

		$locationProvider.html5Mode(true);
	}]);
	
angular.module("Services", ["TestService"]);
angular.module("Filters", ["TestFilter"]);
angular.module("Directives", ["TestDirective"]);
angular.module("Controllers", ["HomeControllers", "ContactControllers"]);