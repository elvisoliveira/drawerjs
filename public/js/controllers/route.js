angular
	.module("docs.controllers")
	.controller("RouteCtrl", ["$rootScope", "$route", function ($rootScope, $route) {
		$rootScope.activetab = $route.current.activetab;
		$rootScope.current = $route.current.name;
	}]);