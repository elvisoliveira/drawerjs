angular.module("docs", ["ngRoute", "ngAnimate", "docs.services", "docs.filters", "docs.directives", "docs.controllers"]).config(["$routeProvider", "$locationProvider", function ($routeProvider, $locationProvider) {

	var config = {
			index: {
				activetab: "index",
				name: "Drawer",
				templateUrl : "partials/index",
				controller : "RouteCtrl"
			},
			documentation: {
				usage: {
					activetab: "usage",
					name: "Usage",
					templateUrl : "partials/documentation/usage",
					controller : "RouteCtrl"
				},
				options: {
					activetab: "options",
					name: "Options",
					templateUrl: "partials/documentation/options",
					controller : "RouteCtrl"
				},
				api: {
					activetab: "api",
					name: "API",
					templateUrl: "partials/documentation/api",
					controller : "RouteCtrl"
				},
				jquery: {
					activetab: "jquery",
					name: "jQuery",
					templateUrl: "partials/documentation/jquery",
					controller : "RouteCtrl"
				},
				amd: {
					activetab: "amd",
					name: "API",
					templateUrl: "partials/documentation/amd",
					controller : "RouteCtrl"
				}
			},
			installation: {
				bower: {
					activetab: "bower",
					name: "Bower",
					templateUrl : "partials/installation/bower",
					controller : "RouteCtrl"
				},
				source: {
					activetab: "source",
					name: "Source",
					templateUrl : "partials/installation/source",
					controller : "RouteCtrl"
				}
			},
			compatibility: {
				methods: {
					activetab: "methods",
					name: "Methods",
					templateUrl : "partials/compatibility/methods",
					controller : "RouteCtrl"
				},
				support: {
					activetab: "support",
					name: "Support",
					templateUrl : "partials/compatibility/support",
					controller : "RouteCtrl"
				}
			},
			bugs: {
				requests: {
					activetab: "requests",
					name: "Features",
					templateUrl : "partials/bugs/requests",
					controller : "RouteCtrl"
				},
				report: {
					activetab: "report",
					name: "Report Bugs",
					templateUrl : "partials/bugs/report",
					controller : "RouteCtrl"
				}
			}
		};

	$routeProvider.when("/", config.index);
	$routeProvider.when("/documentation/usage", config.documentation.usage);
	$routeProvider.when("/documentation/options", config.documentation.options);
	$routeProvider.when("/documentation/api", config.documentation.api);
	$routeProvider.when("/documentation/jquery", config.documentation.jquery);
	$routeProvider.when("/documentation/amd", config.documentation.amd);
	$routeProvider.when("/installation/bower", config.installation.bower);
	$routeProvider.when("/installation/source", config.installation.source);
	$routeProvider.when("/compatibility/methods", config.compatibility.methods);
	$routeProvider.when("/compatibility/support", config.compatibility.support);
	$routeProvider.when("/bugs/requests", config.bugs.requests);
	$routeProvider.when("/bugs/report", config.bugs.report);
	$routeProvider.otherwise({ redirectTo : "/" });
	$locationProvider.html5Mode(true);
}]);

angular.module("docs.services", []);
angular.module("docs.filters", []);
angular.module("docs.directives", []);
angular.module("docs.controllers", []);