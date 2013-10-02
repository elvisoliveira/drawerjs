/**
 * Configuration
 */

var path = require("path"),
	fs = require("fs"),
	crypto = require("crypto"),
	url = require("url");


var Configuration = function () {

	this.configvars = this.getConfigVars();
	this.package = require(path.resolve(__dirname, "package.json"));

	this.bower = {};
	this.bower.rc = JSON.parse(fs.readFileSync(path.resolve(__dirname, ".bowerrc"), "utf8"));
	this.bower.settings = require(path.resolve(__dirname, this.bower.rc.json));

	this.server = {};
	this.server.process = {};
	this.server.process.environment = this.configvars ? this.configvars.NODE_ENV : process.env.NODE_ENV;
	this.server.state = {};
	this.server.state.development = this.server.process.environment === "development" ? true : false;
	this.server.state.production = this.server.process.environment === "production" ? true : false;
	this.server.cookie = {};
	this.server.cookie.http = true;
	this.server.cookie.secret = crypto.randomBytes(256).toString("hex");
	this.server.cookie.secure = false;
	this.server.environment = {};
	this.server.environment.development = {};
	this.server.environment.development.port = this.configvars ? this.configvars.PORT : process.env.PORT;
	this.server.environment.production = {};
	this.server.environment.production.port = process.env.PORT;
	this.server.static = {};
	this.server.static.destination = "assets";
	this.server.static.source = "public";

	var uri = url.parse(this.configvars ? this.configvars.REDISCLOUD_URL : process.env.REDISCLOUD_URL);
	
	this.databses = {};
	this.databses.redis = {};
	this.databses.redis.host = uri.hostname;
	this.databses.redis.port = uri.port
	this.databses.redis.auth = uri.auth.split(":")[1];

	this.application = {};
	this.application.analytics = {};
	this.application.analytics.domain = "drawerjs.rolandjitsu.com";
	this.application.analytics.id = "UA-39362355-4";
	this.application.favicons = {};
	this.application.favicons.directory = "ico";
	this.application.favicons.touch = "touch";
	this.application.favicons.startup = "startup";
};


Configuration.prototype = {
	getConfigVars: function () {

		var object = {},
			env = path.resolve(__dirname, ".env"),
			pattern = function ($0, $1, $2, $3) {
				object[$1] = $3 ? Number($3) : $2;
			};

		if (fs.existsSync(env)) fs.readFileSync(env, "utf8").replace(/(\w+)=((\d+)|.+)/g, pattern);

		var size = object === null || object === void 0 ? 0 : Array.isArray(object) || (typeof object === "string" || object instanceof String) ? object.length : Object.keys(object).length;

		return size === 0 ? undefined : object;
	}
};


/**
 * Export Configuration Object
 */

module.exports = new Configuration();