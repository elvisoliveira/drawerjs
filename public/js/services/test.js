angular
	.module("TestService", [])
	.service("ServiceExample", function () {

		this.sayHello = function () {

			return "Hello, World!";
		};
	})
	.factory("FactoryExample", function () {

		return {

			sayHello : function (name) {
				
				return "Hi " + name + "!";
			}
		};
	});