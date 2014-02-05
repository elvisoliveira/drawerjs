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
	 * Library Defaults & Name
	 */
	
	var namespace = "Drawer",
		defaults = {
			content: "#drawer-content",
			offset:  120,
			navigation: "#drawer-navigation",
			speed: 250
		};


	/**
	 * Utility Class
	 */

	var Utils = function () {
		
		var lastTime = 0,
			transitions = {
				"transition": "transitionend",
				"OTransition": "oTransitionEnd",
				"MozTransition": "transitionend",
				"WebkitTransition": "webkitTransitionEnd"
			};


		this.browser = {};
		this.browser.prefixes = "O ms Moz Webkit".split(" ");
		this.browser.vendors = "o ms moz webkit ".split(" ");

		this.browser.AnimationFrame = (function () {

			var vendor, request, cancel,
				i = this.browser.vendors.length - 1;

			while (i >= 0) {
				vendor = this.browser.vendors[i];
				cancel = window[vendor + "CancelAnimationFrame"] || window[vendor + "CancelRequestAnimationFrame"];
				request = window[vendor + "RequestAnimationFrame"];
				if (this.isFunction(request)) break;
				i--;
			}

			return {
				cancel: cancel,
				request: request
			};
		}).call(this);

		this.browser.RequestAnimationFrame = this.isFunction(this.browser.AnimationFrame.request) ? this.browser.AnimationFrame.request.bind(window) : function (callback, element) {

			var currTime = Date.now(),
				timeToCall = Math.max(0, 16 - (currTime - lastTime)),
				id = window.setTimeout(function () {
					callback(currTime + timeToCall, element);
				}, timeToCall);

			lastTime = currTime + timeToCall;

			return id;
		};

		this.browser.CancelAnimationFrame = this.isFunction(this.browser.AnimationFrame.cancel) ? this.browser.AnimationFrame.cancel.bind(window) : function (id) {
			clearTimeout(id);
		};

		this.browser.supports = {};
		this.browser.supports.pointers = window.navigator.msPointerEnabled;
		this.browser.supports.touch = "ontouchstart" in window || window.DocumentTouch && document instanceof DocumentTouch;

		this.browser.events = (function () {

			var type, key,
				object = {},
				types = {
					"touchstart": "MSPointerDown",
					"touchmove": "MSPointerMove",
					"touchend": "MSPointerUp"
				},
				keys = this.keys(types),
				i = keys.length - 1;

			while (i >= 0) {
				key = keys[i];
				type = types[key];
				object[key.replace("touch", "pointer")] = this.browser.supports.touch ? key : (this.browser.supports.pointers ? type : undefined);
				i--;
			}

			return object;
		}).call(this);

		this.browser.events.resize = "onorientationchange" in window ? "orientationchange" : "resize";


		this.css = {};
		this.css.properties = {};
		this.css.properties.transition = {};
		this.css.properties.transform = {};
		this.css.properties.flexbox = {};
		this.css.properties.flexbox.type = {};

		this.css.properties.transition.property = this.prefixed("transition", "opacity 2s ease");
		this.css.properties.transition.end = transitions[this.css.properties.transition.property];

		this.css.properties.transform.js = this.prefixed("transform", "scale(1)");
		this.css.properties.transform.css = this.hyphen(this.css.properties.transform.js);

		this.css.properties.perspective = this.prefixed("perspective", "1000");
		this.css.properties.backface = this.prefixed("backfaceVisibility", "hidden");
		this.css.properties.touchAction = this.prefixed("touchAction", "none");

		this.css.properties.flexbox.type.edge = this.prefixed("flexBasis", "1px");
		this.css.properties.flexbox.type.legacy = this.prefixed("boxDirection", "reverse");
		this.css.properties.flexbox.type.hybrid = this.prefixed("flexAlign", "end");

		if (this.css.properties.flexbox.type.edge) this.css.properties.flexbox.display = this.hyphen(this.prefixed("flex", "1"));
		if (this.css.properties.flexbox.type.hybrid) this.css.properties.flexbox.display = "-ms-flexbox";
		if (this.css.properties.flexbox.type.legacy && this.isUndefined(this.css.properties.flexbox.type.edge)) this.css.properties.flexbox.display = this.hyphen(this.prefixed("boxDirection", "reverse")).replace("-direction", "");

		this.css.properties.flexbox.length = this.css.properties.flexbox.type.edge ? this.prefixed("flex", "1") : this.prefixed("boxFlex", "1");

		this.css.translate = this.isUndefined(this.css.properties.perspective) ? this.translate2d.bind(this) : this.translate3d.bind(this);
		this.css.animate = this.isUndefined(this.css.properties.transition.property) ? this.animate.bind(this) :  this.transition.bind(this);
	};

	Utils.prototype = {
		animate: function (element, distance, speed) {

			var callback,
				callbacks = Array.prototype.slice.call(arguments, 3),
				i = callbacks.length - 1;

			var rafId, animTime,
				from =  this.bounds(element).left,
				diff = distance - from,
				startTime = Date.now();

			var frame = function (time) {

					animTime = time - startTime;

					if (animTime >= speed) {
						this.css.translate(element, distance);
						this.browser.CancelAnimationFrame(rafId);
						
						while (i >= 0) {
							callback = callbacks[i];
							if (typeof callback === "function") callback.call();
							i--;
						}
					} else {
						this.css.translate(element, from + (animTime / speed * diff));
						rafId = this.browser.RequestAnimationFrame(frame);
					}
				}.bind(this);

			this.browser.RequestAnimationFrame(frame);
		},
		bounds: function (element) {
			return this.isElement(element) ? element.getBoundingClientRect() : {};
		},
		defaults: function (object) {

			var source, keys, j, key,
				args = Array.prototype.slice.call(this.isArguments(arguments) ? arguments : [], 1),
				i = args.length - 1;

			while (i >= 0) {

				source = args[i];
				keys = this.keys(this.isObject(source) ? source : {});
				j = keys.length - 1;
				
				while (j >= 0) {
					key = keys[j];
					if (this.isUndefined(object[key])) object[key] = source[key];
					j--;
				}
				i--;
			}

			return object || {};
		},
		hyphen: function (string) {
			return string.replace(/([A-Z])/g, function (string, first) {
				return "-" + first.toLowerCase();
			}).replace(/^ms-/, "-ms-");
		},
		is: function (object, type) {
			return typeof object === type;
		},
		isArguments: function (object) {
			return this.isObject(object) && Object.prototype.hasOwnProperty.call(object, "callee");
		},
		isArray: Array.isArray,
		isElement: function (object) {
			return this.isFunction(HTMLElement) ? object instanceof HTMLElement : this.isObject(object) ? object.nodeType === 1 : false;
		},
		isEmpty: function (object) {
			return this.size(object) === 0;
		},
		isFunction: function (object) {
			return this.is(object, "function");
		},
		isNull: function (object) {
			return object === null;
		},
		isNumber: function (number) {
			return !isNaN(parseFloat(number)) && isFinite(number);
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
		keys: Object.keys,
		offload: function (fn) {
			setTimeout(fn || function () {}, 0);
		},
		prefixed: function (property, value) {

			if (this.supports(property, value)) return property;

			var prefixed,
				i = this.browser.prefixes.length - 1;

			property = property.charAt(0).toUpperCase() + property.slice(1);

			while (i >= 0) {
				prefixed = this.browser.prefixes[i] + property;
				if (this.supports(prefixed, value)) return prefixed;
				i--;
			}

			return undefined;
		},
		size: function (object) {
			return this.isNull(object) || this.isUndefined(object) ? 0 : this.isArray(object) || this.isString(object) ? object.length : this.keys(object).length;
		},
		supports: function (property, value) {
			return ("CSS" in window && "supports" in window.CSS) ? CSS.supports(this.hyphen(property), value) : !this.isUndefined(document.createElement("drawer").style[property]);
		},
		transition: function (element, distance, speed) {

			var callback,
				callbacks = Array.prototype.slice.call(arguments, 3),
				i = callbacks.length - 1;

			var transition = this.css.properties.transition,
				transitionend = function (event) {

					if (event.target !== element) return;
						
					while (i >= 0) {
						callback = callbacks[i];
						if (typeof callback === "function") callback.call();
						i--;
					}

					element.style[transition.property] = "";
					element.removeEventListener(transition.end, transitionend);
				};

			element.addEventListener(transition.end, transitionend, false);
			
			element.style[transition.property] = this.css.properties.transform.css + " " + speed + "ms";
			this.css.translate(element, distance);
		},
		translate2d: function (element, distance) {
			element.style[this.css.properties.transform.js] = "translate(" + distance + "px, 0)";
		},
		translate3d: function (element, distance) {
			element.style[this.css.properties.transform.js] = "translate(" + distance + "px, 0)" + "translateZ(0)";
		}
	};


	/**
	 * Events Class
	 */

	var Events = function () {};

	Events.prototype = {
		handleEvent: function (event) {
			if (event.type === this.utils.browser.events.pointerstart) return this.start(event);
			if (event.type === this.utils.browser.events.pointermove) return this.move(event);
			if (event.type === this.utils.browser.events.pointerend) return this.utils.offload(this.end());
			if (event.type === this.utils.browser.events.resize) return this.utils.offload(this.reset());
		},
		start: function (event) {

			this.content.addEventListener(this.utils.browser.events.pointermove, this, false);
			this.content.addEventListener(this.utils.browser.events.pointerend, this, false);

			if (this.index) event.preventDefault();

			var pointer = this.utils.browser.supports.touch ? event.touches[0] : {
					pageX: event.pageX,
					pageY: event.pageY
				};

			this.started.x = pointer.pageX;
			this.started.y = pointer.pageY;
			this.started.time = Date.now();
			this.delta = {};
			this.scrolling = undefined;
		},
		move: function (event) {

			event.preventDefault();

			if (this.utils.browser.supports.pointers && !event.isPrimary) return;
			if (this.utils.browser.supports.touch && (event.touches.length > 1 || (event.scale && event.scale !== 1))) return;

			var pointer = this.utils.browser.supports.touch ? event.touches[0] : {
					pageX: event.pageX,
					pageY: event.pageY
				};

			this.delta.x = pointer.pageX - this.started.x;
			this.delta.y = pointer.pageY - this.started.y;

			if (this.utils.isUndefined(this.scrolling)) this.scrolling = Math.abs(this.delta.x) < Math.abs(this.delta.y);
			if (this.scrolling) return;
			if ((this.delta.x < 0 && !this.index) || (this.delta.x > 0 && this.index)) return;

			this.utils.css.translate(this.content, this.index ? this.width - Math.abs(this.delta.x) - this.options.offset : this.delta.x);
		},
		end: function () {

			this.content.removeEventListener(this.utils.browser.events.pointermove, this, false);
			this.content.removeEventListener(this.utils.browser.events.pointerend, this, false);

			var delta = Math.abs(this.delta.x);

			if (!this.index && !this.utils.isNumber(delta)) return;

			var left = this.delta.x < 0,
				half = this.width / 2;

			var isPastHalf = (Date.now() - this.started.time) < 250 && delta > 20 || delta > half,
				isRightPastCenter = this.utils.bounds(this.content).left > half;

			this.slide((isPastHalf && !left && !(isRightPastCenter && this.index) || !isPastHalf && (this.utils.isNumber(delta) || left) && isRightPastCenter) ? 1 : 0);
		},
		slide: function (position) {

			var method = position ? "onOpen" : "onClose",
				fn = this.options[method];

			if (this.utils.isFunction(fn)) fn.call();

			this.utils.css.animate(this.content, position ? this.width - this.options.offset : 0, this.options.speed, position ? this.options.onOpened : this.options.onClosed, this.options.transitioned);
			this.index = position;
		},
		reset: function () {
			this.width = window.document.documentElement.clientWidth;
			this.navigation.style.width = this.width + "px";

			if (this.index) this.slide(0);
		}
	};


	/**
	 * Drawer Class
	 */

	var Drawer = function (element, options) {

		this.options = this.utils.defaults(this.utils.isUndefined(options) ? {} : options, defaults);
		this.element = this.utils.isElement(element) ? element : document.body;
		this.content = this.utils.isElement(this.options.content) ? this.options.content : document.getElementById(/^(?:#([\w-]+))$/.exec(this.options.content)[1]);
		this.navigation = this.utils.isElement(this.options.navigation) ? this.options.navigation : document.getElementById(/^(?:#([\w-]+))$/.exec(this.options.navigation)[1]);

		if (!this.utils.isElement(this.element) || !this.utils.isElement(this.content) || !this.utils.isElement(this.navigation)) return;

		this.index = 0;
		this.width = window.document.documentElement.clientWidth;
		this.delta = {};
		this.started = {};
		this.scrolling = undefined;

		this.element.style.display = this.utils.css.properties.flexbox.display || "block";
		this.element.style.overflowX = "hidden";
		this.element.style[this.utils.css.properties.backface] = "hidden";
		this.element.style[this.utils.css.properties.perspective] = "1000";
		this.content.style[this.utils.css.properties.flexbox.length] = "1";
		this.content.style[this.utils.css.properties.touchAction] = "none";
		this.content.style.zIndex = Math.floor(Math.random() * 1016 + 10);
		this.navigation.style.position = "absolute";
		this.navigation.style.width = this.width + "px";

		window.addEventListener(this.utils.browser.events.resize, this, false);

		if (this.utils.browser.events.pointerstart) this.content.addEventListener(this.utils.browser.events.pointerstart, this, false);

		var slide = this.slide.bind(this);

		return {
			close: function () {
				return slide(0);
			},
			open: function () {
				return slide(1);
			}
		};
	};

	Drawer.prototype = Object.create(Events.prototype, {
		utils: {
			enumerable: true,
			value: new Utils()
		}
	});
	Drawer.prototype.constructor = Drawer;


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