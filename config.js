/**
 * Configuration
 */

var path = require("path"),
	fs = require("fs"),
	crypto = require("crypto");


var Configuration = function () {

	this.environment = this.configvars();
	this.package = require(path.resolve(__dirname, "package.json"));

	this.bower = {};
	this.bower.rc = JSON.parse(fs.readFileSync(path.resolve(__dirname, ".bowerrc"), "utf8"));
	this.bower.settings = require(path.resolve(__dirname, this.bower.rc.json));

	this.server = {};
	this.server.process = {};
	this.server.process.environment = this.environment ? this.environment.NODE_ENV : process.env.NODE_ENV;
	this.server.state = {};
	this.server.state.development = this.server.process.environment === "development" ? true : false;
	this.server.state.production = this.server.process.environment === "production" ? true : false;
	this.server.cookie = {};
	this.server.cookie.http = true;
	this.server.cookie.secret = crypto.randomBytes(128).toString("hex");
	this.server.cookie.secure = false;
	this.server.environment = {};
	this.server.environment.development = {};
	this.server.environment.development.port = this.environment ? this.environment.PORT : process.env.PORT;
	this.server.environment.production = {};
	this.server.environment.production.port = process.env.PORT;
	this.server.static = {};
	this.server.static.destination = "assets";
	this.server.static.source = "public";

	this.application = {};
	this.application.analytics = {};
	this.application.analytics.domain = "drawerjs.rolandjitsu.com";
	this.application.analytics.id = "UA-39362355-4";
	this.application.favicons = {};
	this.application.favicons.directory = "img";
	this.application.favicons.touch = "touch";
	this.application.favicons.startup = "startup";
};

Configuration.prototype = {
	configvars: function () {

		var object = {},
			env = path.resolve(__dirname, ".env"),
			pattern = function ($0, $1, $2, $3) {
				object[$1] = $3 ? Number($3) : $2;
			};

		if (fs.existsSync(env)) fs.readFileSync(env, "utf8").replace(/(\w+)=((\d+)|.+)/g, pattern);

		return object;
	}
};


/**
 * Export Configuration Object
 */

module.exports = new Configuration();