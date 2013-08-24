/**
 * Drawer 2.0.0
 *
 * Website: http://drawerjs.rolandjitsu.com
 * License: MIT | Copyright (c) 2013 Rolandjitsu
 * 
 */

;(function (window, document, undefined) {


	/**
	 * Library Version & Name
	 */
	
	var namespace = "Drawer",
		version = "2.0.0";


	/**
	 * Cache Window / Document / Body / HTML
	 */
	
	var win = this,
		doc = win.document,
		body = doc.body,
		html = doc.documentElement;


	/**
	 * Library Defaults
	 */

	var defaults = {
			content: "#drawer-content",
			offset:  120,
			navigation: "#drawer-navigation",
			speed: 250
		};


	/**
	 * Utility Class
	 */

	var Utils = function Utils() {};

	Utils.prototype = {

		boundings: function (element) {
			return element.getBoundingClientRect();
		},

		contains: function (string, substring) {
			return !!~(string).indexOf(substring);
		},

		defaults: function (object) {
		
			this.each(arguments.slice(1), function (source) {
				this.each(source, function (value, key) {
					if (this.isUndefined(object[key])) object[key] = source[key];
				}, this);
			}, this);

			return object;
		},
		
		each: function (object, iterator, context) {

			var i,
				isArray = this.isArray(object);

			if (isArray) {
				i = object.length - 1;
				while (i >= 0) {
					if (iterator.apply(context, [object[i], i]) === false) break;
					i--;
				}
			} else {
				var key,
					keys = Object.keys(object);
				i = keys.length - 1;
				while (i >= 0) {
					key = keys[i];
					if (iterator.apply(context, [object[i], i]) === false) break;
					i--;
				}
			}
		},

		is: function (object, type) {
			return typeof object === type;
		},

		isArray: Array.isArray,

		isElement: function (object) {
			if (!this.isObject(object)) return false;
			return this.isFunction(HTMLElement) ? object instanceof HTMLElement : object.nodeType === 1;
		},

		isEmpty: function (object) {
			return this.size(object) === 0;
		},

		isFunction: function (object) {
			return this.is(object, "function");
		},

		isNode: function (object) {
			if (!this.isObject(object)) return false;
			return this.isFunction(Node) ? object instanceof Node : this.is(object.nodeType, "number");
		},
		
		isNull: function (object) {
			return object === null;
		},

		isObject: function (object) {
			return object !== null && typeof object === "object";
		},

		isString: function (object) {
			return this.is(object, "string") || object instanceof String;
		},

		isUndefined: function (object) {
			return object === void 0;
		},

		size: function (object) {
			if (this.isNull(object)) return 0;
			return this.isArray(object) || this.isString(object) ? object.length : Object.keys(object).length;
		}
	});

	
	var Browser = function Browser() {};
	
	Browser.prototype = {

		touch: "ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch || window.navigator.msMaxTouchPoints
	};


	var Events = {};

	Events.prototype = {

		offload: function (fn) {
			setTimeout(fn || function () {}, 0);
		},

		handleEvent: function (event) {
			
			var type = event.type,
				transitioned = this.utils.css.properties.transition.end;

			if (type === "touchstart") this.start(event);
			if (type === "touchmove") this.move(event);
			if (type === "touchend") this.offload(this.end(event));
			if (type === transitioned) this.offload(this.transitioned(event));
			if (type === "orientationchange" || type === "resize") this.offload(this.reset(event));
		},

		start: function (event) {

			var touches = event.touches[0],
				time = new Date();

			this.started.x = touches.pageX;
			this.started.y = touches.pageY;
			this.started.time = Number(time);
			this.scrolling = undefined;

			this.content.addEventListener("touchmove", this, false);
			this.content.addEventListener("touchend", this, false);
		},

		move: function (event) {

			var scale = event.scale,
				touches = event.touches;

			if (touches.length > 1 || scale && scale !== 1) return;

			var distance = touches[0];

			this.delta.x = distance.pageX - this.started.x;
			this.delta.y = distance.pageY - this.started.y;

			if (this.utils.isUndefined(this.scrolling)) this.scrolling = !!(this.scrolling || Math.abs(this.delta.x) < Math.abs(this.delta.y));
			if (this.scrolling) return;

			event.preventDefault();

			if ((this.delta.x < 0 && index === 0) || (this.delta.x > 0 && index === 1)) return;

			this.utils.css.translate(this.content, index === 1 ? this.viewport.width - Math.abs(this.delta.x) - this.options.offset : this.delta.x, 0);
		},

		end: function (event) {

			if (this.scrolling) return;

			var left = this.delta.x < 0,
				half = this.viewport.width / 2;

			var dragged = Math.abs(this.delta.x);

			var isPastHalf = (Number(new Date()) - this.started.time) < 250 && dragged > 20 || dragged > half,
				isRightPastCenter = this.utils.boundings(this.content).left > half;

			if (isPastHalf && !left && !(isRightPastCenter && index) || !isPastHalf && !(this.utils.isEmpty(this.delta) || !left) && isRightPastCenter) {
				this.open();
			} else {
				this.close();
			}

			this.utils.removeEventListener(this.content, "touchmove", this, false);
			this.utils.removeEventListener(this.content, "touchend", this, false);
		},

		transitioned: function (event) {

			if (!this.utils.isUndefined(this.options.transitioned)) this.options.transitioned.call();
		},

		open: function () {

			if (this.utils.isFunction(this.options.onOpen) && !index) this.options.onOpen.call();

			this.utils.css.translate(this.content, this.viewport.width - this.options.offset, this.options.speed);
			index = 1;
		},

		close: function () {

			if (this.utils.isFunction(this.options.onClose) && index) this.options.onClose.call();

			this.utils.css.translate(this.content, 0, this.options.speed);
			index = 0;
		},

		reset: function (event) {

			this.viewport.width = this.win.screen.width;
			this.navigation.style.width = this.viewport.width - this.options.offset + "px";

			if (index) this.close();
		}
	};


	var Drawer = function Drawer(element, options) {

		this.version = version;
		this.options = this.utils.defaults(this.utils.isObject(options) ? options : {}, defaults);
		
		var selectors = {
				element: element,
				content: this.options.content,
				navigation: this.options.navigation
			};

		this.utils.each(selectors, function (selector, key) {
			this[key] = this.utils.isElement(selector) ? selector : doc.getElementById(/^(?:#([\w-]+))$/.exec(selector)[1]);
		}, this);

		if (!this.utils.isElement(this.element) || !this.utils.isNode(this.element)) return;

		var styles = {
				element: this.element.style,
				content: this.content.style,
				navigation: this.navigation.style
			};

		styles.element.display = this.utils.css.properties.display.flexbox;
		styles.element.overflowX = "hidden";
		styles.element[this.utils.css.properties.backface] = "hidden";
		styles.element[this.utils.css.properties.perspective] = "1000";

		styles.content[this.utils.css.properties.flexlength] = "1";
		styles.content.msTouchAction = "none";
		this.utils.css.translate(this.content, 0, 0);

		styles.navigation.width = win.screen.width - this.options.offset + "px";
		styles.navigation.position = "absolute";

		if (this.utils.browser.supports.touch) this.content.addEventListener("touchstart", this.events, false);
		if (this.utils.browser.supports.transition) this.content.addEventListener(this.utils.css.properties.transition.end, this.events, false);
		win.addEventListener("onorientationchange" in win ? "orientationchange" : "resize", this.events, false);
	};

	Drawer.prototype = {

		constructor: Drawer,
		utils: new Utils(),
		events: function () {
			return Object.create(events, {
				delta: {
					value: {},
					writable: true
				},
				options: {
					value: this.options,
					enumerable: true
				},
				started: {
					value: {},
					writable: true
				},
				scrolling: {
					value: undefined,
					writable: true
				},
				utils: {
					value: this.utils,
					enumerable: true
				},
				win: {
					enumerable: true,
					value: win
				},
				viewport: {
					enumerable: true,
					value: {
						width: html.clientWidth,
						height: html.clientHeight
					},
					writable: true
				}
			});
		}
	};


	/**
	 * AMD Support
	 */

	if (typeof define === "function" && typeof define.amd === "object" && define.amd) {

		win[namespace] = Drawer;

		define(function () {
			return Drawer;
		});
	} else {
		win[namespace] = Drawer;
	}

}).apply(this, [this, this.document]);