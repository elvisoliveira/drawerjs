angular
	.module("docs.directives")
	.directive("navigation", [function () {

		var definition = {
				link: function (scope, element, attrs) {

					var options = {
							offset: 80
						},
						drawer = new Drawer(element[0], options);
				}
			};

		return definition;
	}]);