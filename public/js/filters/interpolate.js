angular
	
	.module("TestFilter", [])
	.filter("interpolate", function () {

		return function (text, replacement) {
				
			return String(text).replace(/<\%(.*?)\%>/mg, replacement);
		};

	});