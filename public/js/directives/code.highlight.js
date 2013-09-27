angular
	.module("docs.directives")
	.directive("codeHighlight", function () {

		var definition = {
				restrict: "E",
				replace: true,
				template: "<div><pre data-ng-transclude></pre></div>",
				transclude: true,
				link: function (scope, iElement, iAttrs) {

					var children = iElement.children(),
						code = children[0].children[0],
						highlight = function () {
							if (iAttrs.syntax !== undefined) code.className = iAttrs.syntax;
							hljs.highlightBlock(code);
						};

					scope.$watch(children, highlight);
				}
			};

		return definition;
	});