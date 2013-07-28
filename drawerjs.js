;(function (window, document, undefined) {

	"use strict";

	var Drawerjs = function (element, options) {

		this.version = "1.0.0";
		this.options = this.extend({}, this.defaults, options);
		this.content = this.select(this.options.content);
		this.navigation = this.select(this.options.navigation);
		this.element = this.isElement(element) ? element : this.select(element);

		if (this.isElement(this.element) === false) {

			return;
		}

		return this.init();
	};

	Drawerjs.prototype = {

		constructor: Drawerjs,

		array: Array.prototype,
		object: Object.prototype,

		browser: {

			supports: {

				addEventListener: !!window.addEventListener,
				touch: ("ontouchstart" in window) || window.DocumentTouch && document instanceof DocumentTouch,

				transitions: (function (element) {

					var props = ["transitionProperty", "WebkitTransition", "MozTransition", "msTransition", "OTransition"];
					
					for (var i = props.length - 1; i >= 0; i--) {
						
						if (element.style[ props[i] ] !== void 0) {

							return true;
						}
					}
					
					return false;

				})(document.createElement("drawerjs"))
			},

			transitionEnd: (function (element) {

				var transitions = {

						"transition": "transitionend",
						"OTransition": "oTransitionEnd",
						"MozTransition": "transitionend",
						"WebkitTransition": "webkitTransitionEnd"
					},

					transition = null;
				
				for (var prop in transitions) {
					
					if (element.style[prop] !== void 0) {

						transition = transitions[prop];
					}
				}
				
				return transition;

			})(document.createElement("drawerjs"))
		},

		isScrolling: null,
		start: {},
		delta: {},
		index: 0,
		pulled: false,
		viewport: window.innerWidth,

		defaults: {

			transition: 250,
			content: "#drawerjs-content",
			offset: 80,
			navigation: "#drawerjs-navigation",
			scrolling: true,
			speed: 250
		},

		noop: function () {},

		offLoadFn: function (fn) {

			setTimeout(fn || this.noop, 0);
		},

		objectHasKey: function (object, key) {

			return this.hasOwnProperty.call(object, key);
		},

		isUndefined: function (object) {
			
			return object === void 0;
		},

		isArray: Array.isArray || function(object) {

			return this.object.toString.call(object) == "[object Array]";
		},

		isString: function (object) {
			
			return this.object.toString.call(object) == "[object String]";
		},

		isEmpty: function (object) {
		
			if (object === null) {

				return true;
			}

			if (this.isArray(object) || this.isString(object)) {

				return object.length === 0;
			}

			for (var key in object) {

				if (this.objectHasKey(object, key)) {

					return false;
				}
			}

			return true;
		},

		isElement: function (object) {

			return !!(object && object.nodeType === 1);
		},

		each: function (object, iterator, context) {

			if (object === null) {

				return;
			}

			if (this.array.forEach && object.forEach === this.array.forEach) {

				object.forEach(iterator, context);
			} else if (object.length === + object.length) {

				for (var i = object.length - 1; i >= 0; i--) {
					
					if (iterator.call(context, object[i], i, object) === {}) {

						return;
					}
				}
			} else {

				for (var key in object) {

					if (this.objectHasKey(object, key)) {
					
						if (iterator.call(context, object[key], key, object) === {}) {

							return;
						}
					}
				}
			}
		},

		extend: function (object) {

			this.each(this.array.slice.call(arguments, 1), function (source) {
				
				if (source) {

					for (var prop in source) {

						object[prop] = source[prop];
					}
				}
			});

			return object;
		},

		select: function (selector) {

			var regex = /^(?:#([\w-]+))$/,
				test = regex.exec(selector);

			if (test !== null) {

				return document.getElementById(test[1]);
			}

			return [];
		},

		translate: function (element, distance, speed) {

			var style = element.style,
				durationProps = ["webkitTransitionDuration", "MozTransitionDuration", "msTransitionDuration", "OTransitionDuration", "transitionDuration"],
				transformProps = ["msTransform", "MozTransform", "OTransform"];

			this.each(durationProps, function (prefixed) {

				style[prefixed] = speed + "ms";
			});

			style.webkitTransform = "translate(" + distance + "px, 0)" + "translateZ(0)";

			this.each(transformProps, function (prefixed) {

				style[prefixed] = "translateX(" + distance + "px)";
			});
		},

		init: function () {

			this.setup();

			if (this.browser.supports.addEventListener) {

				if (this.browser.supports.touch) {

					this.content.addEventListener("touchstart", this, false);
				}

				if (this.browser.supports.transitions) {
					
					this.content.addEventListener(this.browser.transitionEnd, this, false);
				}

				window.addEventListener("resize", this, false);
			} else {

				window.onresize = function () {

					this.reset();
				};
			}
		},

		setup: function () {

			var elementStyle = this.element.style,
				contentStyle = this.content.style,
				transitions = ["webkitTransition", "MozTransition", "msTransition", "OTransition", "transition"],
				that = this;

			var display = ["-webkit-box", "-moz-box", "-ms-flexbox", "-webkit-flex", "flex"];

			for (var i = display.length - 1; i >= 0; i--) {

				elementStyle.display = display[i];

				if (window.getComputedStyle(this.element, null).display === display[i]) {

					break;
				}
			}

			elementStyle.webkitTouchCallout = "none";
			elementStyle.webkitTapHighlightColor = "rgba(000, 000, 000, 0)";
			elementStyle.webkitTextSizeAdjust = "none";
			elementStyle.webkitFontSmoothing = "antialiased";
			elementStyle.webkitUserSelect = "none";
			elementStyle.webkitBackfaceVisibility = "hidden";
			elementStyle.mozBackfaceVisibility = "hidden";
			elementStyle.msBackfaceVisibility = "hidden";
			elementStyle.overflowX = "hidden";

			if (this.options.transition !== 0) {

				this.each(transitions, function (transition) {

					elementStyle[transition] = "opacity " + that.options.transition + "ms" + " ease-in" + ", visibility " + that.options.transition + "ms" + " ease-in";
				});
			}

			contentStyle.webkitBoxFlex = "1";
			contentStyle.mozBoxFlex = "1";
			contentStyle.webkitFlex = "1 1 auto";
			contentStyle.msFflex = "1 1 auto";
			contentStyle.flex = "1 1 auto";

			this.translate(this.content, 0, 0);

			elementStyle.visibility = "visible";
			
			if (this.options.transition !== 0) {

				elementStyle.opacity = 1;
			}
		},

		reset: function () {

			this.__proto__.viewport = window.innerWidth;

			if (this.__proto__.index === 1) {

				this.close();
			}
		},

		open: function () {

			if (this.__proto__.pulled === false && this.isUndefined(this.options.onOpen) !== true) {

				this.options.onOpen.call();
			}

			this.translate(this.content, this.__proto__.viewport - this.options.offset, this.options.speed);
			this.__proto__.index = 1;
			this.__proto__.pulled = true;
		},

		close: function () {
			
			if (this.__proto__.pulled === true && this.isUndefined(this.options.onClose) !== true) {
				
				this.options.onClose.call();
			}

			this.translate(this.content, 0, this.options.speed);
			this.__proto__.index = 0;
			this.__proto__.pulled = false;
		},

		handleEvent: function (event) {

			switch (event.type) {
			case "touchstart":

				this.onTouchStart(event);
				break;
			case "touchmove":
				
				this.onTouchMove(event);
				break;
			case "touchend":

				this.offLoadFn(this.onTouchEnd(event));
				break;
			case this.browser.transitionEnd:

				this.offLoadFn(this.onTransitionEnd(event));
				break;
			case "resize":

				this.offLoadFn(this.reset.call());
				break;
			}
		},

		onTouchStart: function (event) {

			var touches = event.touches[0];

			this.__proto__.start = {

				x: touches.pageX,
				y: touches.pageY,
				time: +new Date()
			};

			this.__proto__.isScrolling = undefined;
			this.__proto__.delta = {};

			this.content.addEventListener("touchmove", this, false);
			this.content.addEventListener("touchend", this, false);
		},

		onTouchMove: function (event) {

			if (event.touches.length > 1 || event.scale && event.scale !== 1) {

				return;
			}

			if (this.isUndefined(this.options.scrolling) === false && this.options.scrolling === false) {

				event.preventDefault();
			}

			var touches = event.touches[0];

			this.__proto__.delta = {

				x: touches.pageX - this.__proto__.start.x,
				y: touches.pageY - this.__proto__.start.y
			};

			if (this.isUndefined(this.__proto__.isScrolling)) {

				this.__proto__.isScrolling = !!(this.__proto__.isScrolling || Math.abs(this.__proto__.delta.x) < Math.abs(this.__proto__.delta.y));
			}

			if (!this.__proto__.isScrolling) {

				event.preventDefault();

				if ((this.__proto__.delta.x < 0 && this.__proto__.index === 0 ) || (this.__proto__.delta.x > 0 && this.__proto__.index === 1)) {

					return;
				}

				this.translate(this.content, this.__proto__.index === 1 ? this.__proto__.viewport - Math.abs(this.__proto__.delta.x) - this.options.offset: this.__proto__.delta.x, 0);
			}
		},

		onTouchEnd: function (event) {

			var duration = +new Date() - this.__proto__.start.time,
				isPastHalf = Number(duration) < 250 && Math.abs(this.__proto__.delta.x) > 20 || Math.abs(this.__proto__.delta.x) > this.__proto__.viewport / 2,
				direction = this.__proto__.delta.x < 0;

			if (!this.__proto__.isScrolling) {

				if (isPastHalf) {

					if (direction) {

						this.close();
					} else {

						if (this.content.getBoundingClientRect().left > this.__proto__.viewport / 2 && this.__proto__.pulled === true) {

							this.close();

							return;
						}

						this.open();
					}
				} else {
									
					if (this.content.getBoundingClientRect().left > this.__proto__.viewport / 2) {

						if (this.isEmpty(this.__proto__.delta) || this.__proto__.delta.x > 0) {

							this.close();

							return;
						}

						this.open();

						return;
					}

					this.close();
				}
			}

			this.content.removeEventListener("touchmove", this, false);
			this.content.removeEventListener("touchend", this, false);
		},

		onTransitionEnd: function (event) {

			if (this.isUndefined(this.options.transitioned) === false) {

				this.options.transitioned.call();
			}
		}
	};


	/**
	 * AMD Support
	 */

	if (typeof define === "function" && typeof define.amd === "object" && define.amd) {

		window.Drawerjs = Drawerjs;

		define(function() {
	
			return Drawerjs;
		});
	} else {
		
		window.Drawerjs = Drawerjs;		
	}
    
}).apply(this, [this, this.document]);