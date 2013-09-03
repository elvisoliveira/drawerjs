(function ($, window, document, undefined) {

	/**
	 * Plugin Definition
	 */

	var old = $.fn.drawer;

	$.fn.drawer = function (option) {

		return this.each(function () {

			var $this = $(this),
				data = $this.data("drawer"),
				options = $.extend({}, $.fn.drawer.defaults, $this.data(),  option !== null && typeof option === "object" && typeof option !== "function" ? option : {});

			if (!data) {

				data = new Drawer(this, options);

				$this.data("drawer", data);
			}

			if (typeof option === "string") {

				data[option]();
			}
		});
	};

	$.fn.drawer.defaults = {};

	$.fn.drawer.Constructor = Drawer;


	/**
	 * Avoid Conflicts
	 */

	$.fn.drawer.noConflict = function () {
		
		$.fn.drawer = old;
		
		return this;
	};

})(window.jQuery || window.Zepto, this, this.document);