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

(function (window, document, undefined) {


	/**
	 * Library Version & Name
	 */
	
	var namespace = "Drawer",
		version = "2.0.0";


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

	var Utils = function () {

		this.prefixes = "O ms Moz Webkit".split(" ");

		this.prototypes = {};

		this.prototypes.arr =  Array.prototype;
		this.prototypes.obj = Object.prototype;
		this.prototypes.fn = Function.prototype;

		this.slice = this.prototypes.arr.slice;
	};

	Utils.prototype = {
		bind: function (fn, context) {
			
			if (!this.isFunction(fn)) return;
			
			var args, bound, Ctor, slice;

			if (this.prototypes.fn.bind && fn.bind === this.prototypes.fn.bind) return this.prototypes.fn.bind.apply(fn, this.slice.call(arguments, 1));
			
			slice = this.slice;
			args = this.slice.call(arguments, 2);
			Ctor = function () {};

			bound = function () {

				if (!(this instanceof bound)) return fn.apply(context, args.concat(slice.call(arguments)));
				
				Ctor.prototype = fn.prototype;

				var self = new Ctor(),
					result = fn.apply(self, args.concat(slice.call(arguments)));

				Ctor.prototype = null;
				
				if (Object(result) === result) return result;
				
				return self;
			};

			return bound;
		},
		boundings: function (element) {
			return element.getBoundingClientRect();
		},
		contains: function (string, substring) {
			return !!~(string).indexOf(substring);
		},
		defaults: function (object) {

			this.each(this.slice.call(arguments, 1), function (source) {
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
					keys = this.keys(object);

				i = keys.length - 1;
				
				while (i >= 0) {
					key = keys[i];
					if (iterator.apply(context, [object[key], key]) === false) break;
					i--;
				}
			}
		},
		has: function (object, key) {
			return this.prototypes.obj.hasOwnProperty.call(object, key);
		},
		hyphen: function (string) {
			return string.replace(/([A-Z])/g, function (string, $1) {
				return "-" + $1.toLowerCase();
			}).replace(/^ms-/, "-ms-");
		},
		is: function (object, type) {
			return typeof object === type;
		},
		isArray: Array.isArray || function (object) {
			return object instanceof Array;
		},
		isElement: function (object) {
			if (!this.isObject(object)) return false;
			return HTMLElement instanceof Object ? object instanceof HTMLElement : object.nodeType === 1;
		},
		isEmpty: function (object) {
			return this.size(object) === 0;
		},
		isFunction: function (object) {
			return this.is(object, "function");
		},
		isNode: function (object) {
			if (!this.isObject(object)) return false;
			return Node instanceof Object ? object instanceof Node : this.is(object.nodeType, "number");
		},
		isNull: function (object) {
			return object === null;
		},
		isObject: function (object) {
			return object !== null && this.is(object, "object") && !this.is(object, "function");
		},
		isString: function (object) {
			return this.is(object, "string") || object instanceof String;
		},
		isUndefined: function (object) {
			return object === void 0;
		},
		keys: Object.keys || function (object) {

			if (!this.isObject(object)) return;

			var property,
				result = [];

			for (property in object) {
				if (this.has(object, property)) result.push(property);
			}

			return result;
		},
		prefixed: function (property, value) {

			if (this.supports(property, value)) return property;

			var prefixed,
				i = this.prefixes.length - 1;

			property = property.charAt(0).toUpperCase() + property.slice(1);

			while (i >= 0) {
				prefixed = this.prefixes[i] + property;
				if (this.supports(prefixed, value)) return prefixed;
				i--;
			}

			return undefined;
		},
		random: function (from, to) {
			return Math.floor(Math.random() * (to - from + 1) + from);
		},
		select: function (string) {
			return document.getElementById(/^(?:#([\w-]+))$/.exec(string)[1]);
		},
		size: function (object) {
			if (this.isNull(object)) return 0;
			return this.isArray(object) || this.isString(object) ? object.length : this.keys(object).length;
		},
		supports: function (property, value) {

			var supports;

			if (("CSS" in window && "supports" in window.CSS)) supports = window.CSS.supports(this.hyphen(property), value);
			else supports = !this.isUndefined(document.createElement("drawer").style[property]);

			return supports ? true : false;
		}
	};


	/**
	 * Browser Class
	 */

	var Browser = function () {
		
		this.supports = {};

		this.supports.pointers = window.navigator.msPointerEnabled;
		this.supports.touch = "ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch;

		this.raf = this.requestAnimationFrame();
		this.caf = this.cancelAnimationFrame();
	};

	Browser.prototype = {
		nativeAnimationFrameMethods: (function () {

			var vendor, raf, caf,
				vendors = "o ms moz webkit ".split(" "),
				i = vendors.length - 1;

			while (i >= 0) {

				vendor = vendors[i];

				caf = window[vendor + "CancelAnimationFrame"] || window[vendor + "CancelRequestAnimationFrame"];
				raf = window[vendor + "RequestAnimationFrame"];

				if (typeof raf === "function") break;

				i--;
			}

			return {
				cancel: caf,
				request: raf
			};
		})(),
		cancelAnimationFrame: function () {
			return utils.isFunction(this.nativeAnimationFrameMethods.cancel) ? utils.bind(this.nativeAnimationFrameMethods.cancel, window) : function (id) {
				clearTimeout(id);
			};
		},
		requestAnimationFrame: function () {

			var lastTime = 0;

			return utils.isFunction(this.nativeAnimationFrameMethods.request) ? utils.bind(this.nativeAnimationFrameMethods.request, window) : function (callback, element) {

				var currTime = Date.now(),
					timeToCall = Math.max(0, 16 - (currTime - lastTime)),
					id = window.setTimeout(function () {
						callback(currTime + timeToCall, element);
					}, timeToCall);

				lastTime = currTime + timeToCall;

				return id;
			};
		}
	};
	

	/**
	 * CSS Class
	 */
	
	var CSS = function () {

		var transitions = {
				"transition": "transitionend",
				"OTransition": "oTransitionEnd",
				"MozTransition": "transitionend",
				"WebkitTransition": "webkitTransitionEnd"
			};

		this.properties = {};

		this.properties.transition = {};
		this.properties.transform = {};
		this.properties.flexbox = {};
		this.properties.flexbox.type = {};

		this.properties.transition.property = utils.prefixed("transition", "opacity 2s ease");
		this.properties.transition.end = transitions[this.properties.transition.property];

		this.properties.transform.js = utils.prefixed("transform", "scale(1)");
		this.properties.transform.css = utils.hyphen(this.properties.transform.js);

		this.properties.perspective = utils.prefixed("perspective", "1000");
		this.properties.backface = utils.prefixed("backfaceVisibility", "hidden");
		this.properties.touchAction = utils.prefixed("touchAction", "none");

		this.properties.flexbox.type.edge = utils.prefixed("flexBasis", "1px");
		this.properties.flexbox.type.legacy = utils.prefixed("boxDirection", "reverse");
		this.properties.flexbox.type.hybrid = utils.prefixed("flexAlign", "end");

		if (this.properties.flexbox.type.edge) this.properties.flexbox.display = utils.hyphen(utils.prefixed("flex", "1"));
		if (this.properties.flexbox.type.hybrid) this.properties.flexbox.display = "-ms-flexbox";
		if (this.properties.flexbox.type.legacy && utils.isUndefined(this.properties.flexbox.type.edge)) this.properties.flexbox.display = utils.hyphen(utils.prefixed("boxDirection", "reverse")).replace("-direction", "");

		this.properties.flexbox.length = this.properties.flexbox.type.edge ? utils.prefixed("flex", "1") : utils.prefixed("boxFlex", "1");
	};

	CSS.prototype = {
		animate: function (element, distance, speed, fn, callback) {

			if (utils.isUndefined(this.properties.transition.property)) return this.pollyfil(element, distance, speed, fn, callback);

			var transition = this.properties.transition,
				transitionend = function (event) {

					if (event.target !== element) return;
					element.style[transition.property] = "";
					element.removeEventListener(transition.end, transitionend);

					if (utils.isFunction(fn)) fn.call();
					if (utils.isFunction(callback)) callback.call();
				};

			element.addEventListener(transition.end, transitionend, false);
			
			element.style[transition.property] = this.properties.transform.css + " " + speed + "ms";
			this.translate(element, distance);
		},
		pollyfil: function (element, distance, speed, fn, callback) {

			var from =  utils.boundings(element).left,
				diff = distance - from,
				startTime = Date.now();

			var rafId,
				frame = utils.bind(function (time) {

					var animTime = time - startTime;

					if (animTime >= speed) {
						this.translate(element, distance);
						browser.caf(rafId);
						if (utils.isFunction(fn)) fn.call();
						if (utils.isFunction(callback)) callback.call();
					} else {
						this.translate(element, from + (animTime / speed * diff));
						rafId = browser.raf(frame);
					}
				}, this);

			browser.raf(frame);
		},
		translate: function (element, distance) {
			element.style[this.properties.transform.js] = "translate(" + distance + "px, 0)" + (this.properties.perspective ? "translateZ(0)" : "");
		}
	};


	/**
	 * Events Object
	 */

	var Events = {
		offload: function (fn) {
			setTimeout(fn || function () {}, 0);
		},
		handleEvent: function (event) {
			
			var type = event.type,
				events = {
					start: /touchstart|MSPointerDown/,
					move: /touchmove|MSPointerMove/,
					end: /touchend|MSPointerUp/,
					resize: /orientationchange|resize/
				};

			if (events.start.test(type)) this.start(event);
			if (events.move.test(type)) this.move(event);
			if (events.end.test(type)) this.offload(this.end(event));
			if (events.resize.test(type)) this.offload(this.reset(event));
		},
		start: function (event) {

			if (this.index) event.preventDefault();

			var pointer = browser.supports.touch ? event.touches[0] : {
					pageX: event.pageX,
					pageY: event.pageY
				};

			if (browser.supports.pointers && event.pointerType === event.MSPOINTER_TYPE_TOUCH) this.pointers.push(event.pointerId);

			this.started.x = pointer.pageX;
			this.started.y = pointer.pageY;
			this.started.time = browser.supports.pointers ? event.timeStamp : Date.now();

			if (!utils.isEmpty(this.delta)) this.delta = {};

			this.scrolling = undefined;

			this.content.addEventListener(browser.supports.touch ? "touchmove" : "MSPointerMove", this, false);
			this.content.addEventListener(browser.supports.touch ? "touchend" : "MSPointerUp", this, false);
		},
		move: function (event) {

			var scale = event.scale,
				pointers = browser.supports.touch ? event.touches : (browser.supports.pointers && event.pointerType === event.MSPOINTER_TYPE_TOUCH ? this.pointers : []);

			if (pointers.length > 1 || scale && scale !== 1) return;

			var pointer = browser.supports.touch ? pointers[0] : {
					pageX: event.pageX,
					pageY: event.pageY
				};

			this.delta.x = pointer.pageX - this.started.x;
			this.delta.y = pointer.pageY - this.started.y;

			if (utils.isUndefined(this.scrolling)) this.scrolling = Math.abs(this.delta.x) < Math.abs(this.delta.y);
			if (this.scrolling) return;

			event.preventDefault();

			if ((this.delta.x < 0 && !this.index) || (this.delta.x > 0 && this.index)) return;

			css.translate(this.content, this.index ? this.viewport.width - Math.abs(this.delta.x) - this.options.offset : this.delta.x);
		},
		end: function (event) {

			if (this.scrolling) return;

			var left = this.delta.x < 0,
				half = this.viewport.width / 2;

			var dragged = Math.abs(this.delta.x);

			var isPastHalf = (Date.now() - this.started.time) < 250 && dragged > 20 || dragged > half,
				isRightPastCenter = utils.boundings(this.content).left > half;

			if (isPastHalf && !left && !(isRightPastCenter && this.index) || !isPastHalf && !(utils.isEmpty(this.delta) || !left) && isRightPastCenter) {
				this.open();
			} else {
				this.close();
			}

			if (browser.supports.pointers && event.pointerType === event.MSPOINTER_TYPE_TOUCH) this.pointers = [];
			
			this.content.removeEventListener(browser.supports.touch ? "touchmove" : "MSPointerMove", this, false);
			this.content.removeEventListener(browser.supports.touch ? "touchend" : "MSPointerUp", this, false);
		},
		open: function () {

			var isOpening = utils.isFunction(this.options.onOpen) && !this.index;

			if (isOpening) this.options.onOpen.call();

			css.animate(this.content, this.viewport.width - this.options.offset, this.options.speed, isOpening ? this.options.onOpened : undefined, this.options.transitioned);
			this.index = 1;
		},
		close: function () {

			var isClosing = utils.isFunction(this.options.onClose) && this.index;

			if (isClosing) this.options.onClose.call();

			css.animate(this.content, 0, this.options.speed, isClosing ? this.options.onClosed : undefined, this.options.transitioned);
			this.index = 0;
		},
		reset: function () {

			this.viewport.width = window.document.documentElement.clientWidth;
			this.navigation.style.width = this.viewport.width - this.options.offset + "px";

			if (this.index) this.close();
		}
	};


	/**
	 * Instantiate Utils / Browser / CSS Classes
	 */

	var utils = new Utils(),
		browser = new Browser(),
		css = new CSS();
	

	/**
	 * Drawer Class
	 */

	var Drawer = function (element, options) {

		this.events.options = utils.defaults(utils.isObject(options) ? options : {}, defaults);
		this.events.element = utils.isElement(element) ? element : utils.select(element);
		this.events.content = utils.isElement(this.events.options.content) ? this.events.options.content : utils.select(this.events.options.content);
		this.events.navigation = utils.isElement(this.events.options.navigation) ? this.events.options.navigation : utils.select(this.events.options.navigation);

		if (!utils.isElement(this.events.element) || !utils.isElement(this.events.content) || !utils.isElement(this.events.navigation)) return;

		this.events.element.style.display = css.properties.flexbox.display;
		this.events.element.style.overflowX = "hidden";
		this.events.element.style[css.properties.backface] = "hidden";
		this.events.element.style[css.properties.perspective] = "1000";
		this.events.content.style[css.properties.flexbox.length] = "1";
		this.events.content.style[css.properties.touchAction] = "none";
		this.events.content.style.zIndex = utils.random(10, 1000);
		this.events.navigation.style.position = "absolute";
		this.events.navigation.style.width = window.document.documentElement.clientWidth - this.events.options.offset + "px";

		window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", this.events, false);

		if (browser.supports.touch || browser.supports.pointers) this.events.content.addEventListener(browser.supports.touch ? "touchstart" : "MSPointerDown", this.events, false);

		return {
			close: utils.bind(this.events.close, this.events),
			content: this.events.content,
			element: this.events.element,
			navigation: this.events.navigation,
			open: utils.bind(this.events.open, this.events),
			options: this.events.options,
			version: version
		};
	};

	Drawer.prototype = {

		constructor: Drawer,
		events: Object.create(Events, {
			delta: {
				value: {},
				writable: true
			},
			index: {
				value: 0,
				writable: true
			},
			started: {
				value: {},
				writable: true
			},
			scrolling: {
				value: undefined,
				writable: true
			},
			pointers: {
				enumerable: true,
				value: [],
				writable: true
			},
			viewport: {
				enumerable: true,
				value: {
					width: window.document.documentElement.clientWidth,
					height: window.document.documentElement.clientHeight
				},
				writable: true
			}
		})
	};


	/**
	 * AMD Support
	 */

	if (typeof define === "function" && typeof define.amd === "object" && define.amd) {

		window[namespace] = Drawer;

		define(function () {
			return Drawer;
		});
	} else {
		window[namespace] = Drawer;
	}

}).apply(this, [this, this.document]);