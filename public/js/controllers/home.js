angular
	.module("HomeControllers", [])
	.controller("HomeTestCtrl", ["$http", function ($http) {
		
		$http({

			method: "GET",
			url: "/api/test"
		})
			.success(function (data) {

				console.log(data);
			})

			.error(function (data) {
				
				console.log(data);
			});

	}]);