angular
	.module("docs.directives")
	.directive("canvasNavigation", ["$location", function ($location) {

		var definition = {
				restrict: "A",
				controller: function ($scope, $element, $attrs) {},
				link: function (scope, element, attrs) {

					var redirect = function () {
							console.log("closed")
							$location.path("/documentation/options");
						},
						options = {
							offset: 80,
							onClosed: redirect
						},
						drawer = new Drawer(element[0], options),
						links = document.getElementById("drawer-navigation").children[0].children;

					//console.log($location, links);

					scope.drawer = {};
					scope.drawer.open = function (event) {
						event.preventDefault();
						drawer.open();
					};
				}
			};

		return definition;
	}]);