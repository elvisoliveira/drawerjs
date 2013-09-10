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

	this.browser.AnimationFrame = (function () {

		var vendor, request, cancel,
			vendors = "o ms moz webkit ".split(" "),
			i = vendors.length - 1;

		while (i >= 0) {
			vendor = vendors[i];
			cancel = window[vendor + "CancelAnimationFrame"] || window[vendor + "CancelRequestAnimationFrame"];
			request = window[vendor + "RequestAnimationFrame"];
			if (typeof request === "function") break;
			i--;
		}

		return {
			cancel: cancel,
			request: request
		};
	})();

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