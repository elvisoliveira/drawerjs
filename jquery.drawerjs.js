;(function ($, window, document, undefined) {

	/**
	 * Plugin Definition
	 */

	var old = $.fn.drawerjs;

	$.fn.drawerjs = function (option) {

		return this.each(function () {

			var $this = $(this),
				data = $this.data("drawerjs"),
				options = $.extend({}, $.fn.drawerjs.defaults, $this.data(), typeof option === "object" ? option : {});

			if (!data) {

				data = new Drawerjs(this, options);

				$this.data("drawerjs", data);
			}

			if (typeof option == "string") {

				data[option]();
			}
		});
	};

	$.fn.drawerjs.defaults = {};

	$.fn.drawerjs.Constructor = Drawerjs;


	/**
	 * Avoid Conflicts
	 */

	$.fn.drawerjs.noConflict = function () {
		
		$.fn.drawerjs = old;
		
		return this;
	};

})(window.jQuery || window.Zepto, this, this.document);