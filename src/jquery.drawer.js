/**
 *
 * Drawer 2.0.0
 *
 * A simple off canvas navigation built with JavaScript & CSS3. It's library agnostic, provides support for jQuery and AMD and it's simple to set up and use.
 *
 * Website: http://drawerjs.rolandjitsu.com/
 * Repository: https://github.com/rolandjitsu/drawerjs.git
 * Bugs: https://github.com/rolandjitsu/drawerjs/issues
 *
 * Copyright (c) 2013 Rolandjitsu
 * License MIT: https://github.com/rolandjitsu/drawerjs/blob/master/LICENSE.md 
 *
 */


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

})(this.jQuery || this.Zepto, this, this.document);