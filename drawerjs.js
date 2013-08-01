/**
 * Drawerjs 1.0.0
 *
 * [Drawerjs](http://drawerjs.rolandjitsu.com)
 * Copyright (c) 2013 Rolandjitsu
 * [License](https://github.com/rolandjitsu/drawerjs/blob/master/LICENSE.md)
 *
 */

(function (window, document, undefined) {

	"use strict";

	var viewport = window.innerWidth;

	var isScrolling = null,
		pulled = false;

	var start = {},
		delta = {},
		index = 0;

	var defaults = {

			content: "#drawerjs-content",
			offset: 120,
			navigation: "#drawerjs-navigation",
			scrolling: true,
			speed: 250
		};

	var Utils = function () {

		this.prototypes = {

			array: Array.prototype,
			fn: Function.prototype,
			object: Object.prototype
		};

		this.drawerjs = "drawerjs";

		this.elements = {
			document: document.documentElement,
			drawerjs: document.createElement(this.drawerjs)
		};

		this.style = this.elements.drawerjs.style;
		this.body = document.body;

		this.breaker = {};

		this.touch = {
			callout: this.prefixed("touchCallout"),
			hightlight: this.prefixed("tapHighlightColor"),
			select: this.prefixed("userSelect")
		};

		this.text = {
			adjust: this.prefixed("textSizeAdjust"),
			smoothing: this.prefixed("fontSmoothing")
		};

		this.backface = this.prefixed("backfaceVisibility");

		var transitions = {
				"transition": "transitionend",
				"OTransition": "oTransitionEnd",
				"MozTransition": "transitionend",
				"WebkitTransition": "webkitTransitionEnd"
			},
			transition = this.prefixed("transition");

		this.transition = {
			duration: this.prefixed("transitionDuration"),
			property: this.prefixed("transitionProperty"),
			end: transitions[transition]
		};

		var transform = this.prefixed("transform");

		this.transform = {
			css: this.hyphen(transform),
			js: transform
		};

		this.browser = {
			prefixes: {
				css: ["-webkit-", "-moz-", "-o-", "-ms-"],
				dom: "Webkit Moz O ms"
			},
			supports: {
				addEventListener: this.isUndefined(window.addEventListener) ? false : true,
				touch: (function () {

					var bool,
						prefixes = ["-webkit-", "-moz-", "-o-", "-ms-"].join("touch-enabled), ("),
						media = ["@media (", prefixes, this.drawerjs, ")", "{ #drawerjs { top: 9px; position: absolute; } }"].join("");

					if (("ontouchstart" in window) || window.DocumentTouch && document instanceof DocumentTouch) {
						bool = true;
					} else {
						this.inject(media, function (node) {
							bool = node.offsetTop === 9;
						});
					}

					return bool;
				}).apply(this, []),
				transition: transition !== false ? true : false,
				transforms: this.isTransform3DSupported(),
				flexbox: this.testPropsAll("flexBasis", "1px", true),
				flexboxlegacy: this.testPropsAll("boxDirection", "reverse", true),
				flexboxhybrid: this.testPropsAll("flexAlign", "end", true)
			}
		};

		this.flex = {
			display: (function () {
				if (this.browser.supports.flexbox) return this.hyphen(this.prefixed("flex"));
				if (this.browser.supports.flexboxlegacy) return this.hyphen(this.prefixed("box"));
				if (this.browser.supports.flexboxhybrid) return this.hyphen(this.prefixed("flexbox"));
			}).apply(this, []),
			length: (function () {
				if (this.browser.supports.flexbox) return this.prefixed("flex");
				if (this.browser.supports.flexboxlegacy) return this.prefixed("boxFlex");
			}).apply(this, [])
		};
	};

	Utils.prototype = {

		constructor: Utils,

		noop: function () {},

		offLoadFn: function (fn) {

			setTimeout(fn || this.noop, 0);
		},

		isUndefined: function (object) {
			
			return object === void 0;
		},

		isObject: function (object) {
			
			return object === Object(object);
		},

		isArray: function (object) {

			return Array.isArray(object);
		},

		isString: function (object) {

			return this.prototypes.object.toString.call(object) === "[object String]";
		},

		isFunction: function (object) {

			return this.prototypes.object.toString.call(object) === "[object Function]";
		},

		objectHasKey: function (object, key) {

			return this.prototypes.object.hasOwnProperty.call(object, key);
		},

		contains: function (str, substr) {
			
			return !!~("" + str).indexOf(substr);
		},

		isEmpty: function (object) {
			
			if (object === null) return true;

			if (this.isArray(object) || this.isString(object)) return object.length === 0;

			for (var key in object) {
				if (this.objectHasKey(object, key)) return false;
			}

			return true;
		},

		isElement: function (object) {

			return !!(object && object.nodeType === 1);
		},

		each: function (object, iterator, context) {

			if (object === null) return;

			if (this.prototypes.array.forEach && object.forEach === this.prototypes.array.forEach) {
	
				object.forEach(iterator, context);
			} else if (object.length === + object.length) {

				for (var i = 0, length = object.length; i < length; i++) {

					if (iterator.call(context, object[i], i, object) === this.breaker) return;
				}
			} else {

				for (var key in object) {
					
					if (this.objectHasKey(object, key)) {
						if (iterator.call(context, object[key], key, object) === this.breaker) return;
					}
				}
			}
		},

		extend: function (object) {

			var args = arguments,
				iterator = this.prototypes.array.slice.call(args, 1);

			this.each(iterator, function (source) {
				
				if (source) {
					
					for (var prop in source) {
						if (source.hasOwnProperty(prop)) object[prop] = source[prop];
					}
				}
			});

			return object;
		},

		testProps: function (props, prefixed) {

			var i,
				prop;

			for (i in props) {
				
				if (props.hasOwnProperty(i)) {
					prop = props[i];	
					if (!this.contains(prop, "-") && !this.isUndefined(this.style[prop])) return prefixed === "pfx" ? prop : true;
				}
			}

			return false;
		},

		testDOMProps: function (props, object, element) {

			var i,
				item;

			for (i in props) {

				if (props.hasOwnProperty(i)) {

					item = object[props[i]];
					
					if (!this.isUndefined(item)) {

						if (element === false) return props[i];
						if (this.isFunction(item)) return this.prototypes.fn.bind.call(item, element || object);
						return item;
					}
				}
			}
			
			return false;
		},

		testPropsAll: function (prop, prefixed, element) {

			var prefixes = "Webkit Moz O ms",
				ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),
				props   = (prop + " " + prefixes.split(" ").join(ucProp + " ") + ucProp).split(" ");

			if (this.isString(prefixed) || this.isUndefined(prefixed)) return this.testProps(props, prefixed);
				
			props = (prop + " " + (prefixes.toLowerCase().split(" ")).join(ucProp + " ") + ucProp).split(" ");

			return this.testDOMProps(props, prefixed, element);
		},

		prefixed: function (prop, object, element) {

			if (!object) return this.testPropsAll(prop, "pfx");

			return this.testPropsAll(prop, object, element);
		},

		hyphen: function (string) {

			return string.replace(/([A-Z])/g, function (string, m1) {

				return "-" + m1.toLowerCase();

			}).replace(/^ms-/, "-ms-");
		},

		select: function (selector) {

			var regex = /^(?:#([\w-]+))$/,
				test = regex.exec(selector);

			if (test !== null) return document.getElementById(test[1]);

			return [];
		},

		inject: function (rule, callback, nodes, tests) {

			var style, result, node, overflow,
				div = document.createElement("div"),
				body = this.body || document.createElement("body");

			if (parseInt(nodes, 10)) {

				while (nodes--) {
					node = document.createElement("div");
					node.id = tests ? tests[nodes] : this.drawerjs + (nodes + 1);
					div.appendChild(node);
				}
			}

			style = ["&#173;", "<style id=\"s", this.drawerjs, "\">", rule, "</style>"].join("");
			div.id = this.drawerjs;

			(this.body ? div : body).innerHTML += style;
			body.appendChild(div);

			if (!this.body) {
				body.style.background = "";
				body.style.overflow = "hidden";
				overflow = this.elements.document.style.overflow;
				this.elements.document.style.overflow = "hidden";
				this.elements.document.appendChild(body);
			}

			result = callback(div, rule);
						
			if (!this.body) {
				body.parentNode.removeChild(body);
				this.elements.document.style.overflow = overflow;
			} else {
				div.parentNode.removeChild(div);
			}

			return !!result;
		},

		isTransform3DSupported: function () {

			var result = !!this.testPropsAll("perspective");

			if (result && "webkitPerspective" in this.elements.document.style) {

				this.inject("@media (transform-3d), (-webkit-transform-3d) { #drawerjs { left: 9px; position: absolute; height: 3px; } }", function (node) {
					result = node.offsetLeft === 9 && node.offsetHeight === 3;
				});
			}

			return result;
		},

		translate: function (element, distance, speed) {

			var style = element.style,
				transition = style[this.transition.property];

			style[this.transition.duration] = speed + "ms";
			if(this.isEmpty(transition) || transition !== this.transition.property) style[this.transition.property] = this.transform.css;

			if (this.browser.supports.transforms) {
				style[this.transform.js] = "translate(" + distance + "px, 0)" + "translateZ(0)";
				return;
			}

			style[this.transform.js] = "translateX(" + distance + "px)";
		}
	};

	var Events = function (element, options) {

		this.element = element;
		this.options = options;
	};

	Events.prototype = {

		constructor: Events,

		handleEvent: function (event) {

			var type = event.type;

			if (type === "touchstart") this.start(event);
			if (type === "touchmove") this.move(event);
			if (type === "touchend") utils.offLoadFn(this.end(event));
			if (utils.transition.end) utils.offLoadFn(this.transitioned(event));
			if (type === "resize") utils.offLoadFn(this.reset());
		},

		start: function (event) {

			var touches = event.touches[0];

			start = {
				x: touches.pageX,
				y: touches.pageY,
				time: + new Date()
			};

			isScrolling = undefined;
			delta = {};

			this.element.addEventListener("touchmove", this, false);
			this.element.addEventListener("touchend", this, false);
		},

		move: function (event) {

			if (event.touches.length > 1 || event.scale && event.scale !== 1) return;

			if (utils.isUndefined(this.options.scrolling) === false && this.options.scrolling === false) {
				event.preventDefault();
			}

			var touches = event.touches[0];

			delta = {
				x: touches.pageX - start.x,
				y: touches.pageY - start.y
			};

			if (utils.isUndefined(isScrolling)) {
				isScrolling = !!(isScrolling || Math.abs(delta.x) < Math.abs(delta.y));
			}

			if (isScrolling) return;

			event.preventDefault();

			if ((delta.x < 0 && index === 0) || (delta.x > 0 && index === 1)) return;

			utils.translate(this.element, index === 1 ? viewport - Math.abs(delta.x) - this.options.offset: delta.x, 0);
		},

		end: function () {

			var duration = + new Date() - start.time,
				isPastHalf = Number(duration) < 250 && Math.abs(delta.x) > 20 || Math.abs(delta.x) > viewport / 2,
				left = delta.x < 0,
				right = utils.isEmpty(delta) || delta.x > 0,
				isRightPastCenter = this.element.getBoundingClientRect().left > viewport / 2;

			if (isScrolling) return;

			if (isPastHalf && !left && !(isRightPastCenter && pulled) || !isPastHalf && !right && isRightPastCenter) {
				this.open();
			} else {
				this.close();
			}

			this.element.removeEventListener("touchmove", this, false);
			this.element.removeEventListener("touchend", this, false);
		},

		transitioned: function () {

			if (!utils.isUndefined(this.options.transitioned)) this.options.transitioned.call();
		},

		open: function () {

			if (!pulled && !utils.isUndefined(this.options.onOpen)) this.options.onOpen.call();

			utils.translate(this.element, viewport - this.options.offset, this.options.speed);
			index = 1;
			pulled = true;
		},

		close: function () {
			
			if (pulled && !utils.isUndefined(this.options.onClose)) this.options.onClose.call();

			utils.translate(this.element, 0, this.options.speed);
			index = 0;
			pulled = false;
		},

		reset: function () {

			viewport = window.innerWidth;

			if (index === 1) this.close();
		}
	};

	var utils = new Utils();

	var Drawerjs = function (element, options) {

		this.version = "1.0.0";
		this.options = utils.extend({}, defaults, options);
		
		var selectors = {
				element: element,
				content: this.options.content,
				navigation: this.options.navigation
			},
			isAnyFlex = utils.browser.supports.flexbox || utils.browser.supports.flexboxlegacy || utils.browser.supports.flexboxhybrid;

		utils.each(selectors, function (selector, key) {

			this[key] = utils.isElement(selector) ? selector : utils.select(selector);
		}, this);

		if (!utils.isElement(this.element) || !utils.browser.supports.addEventListener || !isAnyFlex) return;

		var events = new Events(this.content, this.options),
			style = {
				element: this.element.style,
				content: this.content.style,
				navigation: this.navigation.style
			};

		style.element.display = utils.flex.display;
		style.element[utils.touch.callout] = "none";
		style.element[utils.touch.hightlight] = "rgba(000, 000, 000, 0)";
		style.element[utils.touch.select] = "none";
		style.element[utils.text.adjust] = "none";
		style.element[utils.text.smoothing] = "antialiased";
		style.element[utils.backface] = "hidden";
		style.element.overflowX = "hidden";
		style.content[utils.flex.length] = "1";
		utils.translate(this.content, 0, 0);
		style.element.visibility = "visible";

		if (utils.browser.supports.touch) this.content.addEventListener("touchstart", events, false);
		if (utils.browser.supports.transitions) this.content.addEventListener(utils.transition.end, events, false);

		window.addEventListener("resize", this, false);
	};

	Drawerjs.prototype = {

		constructor: Drawerjs
	};


	/**
	 * AMD Support
	 */

	if (typeof define === "function" && typeof define.amd === "object" && define.amd) {

		window.Drawerjs = Drawerjs;

		define(function () {
	
			return Drawerjs;
		});
	} else {
		window.Drawerjs = Drawerjs;
	}

}).apply(this, [this, this.document]);