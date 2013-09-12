angular
	.module("TestDirective", [])
	.directive("appVersion", ["version", function (version) {
		
		return function (scope, elm, attrs) {

			console.log(elm, attrs);

			elm.text(version);
		};

	}]);