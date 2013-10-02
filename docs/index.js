/**
 * Express Application
 */

var path = require("path"),
	express = require("express"),	
	helmet = require("helmet");

var application = module.exports = express(),
	redis = require("connect-redis")(express);

var config = require(path.resolve(process.cwd(), "config.js")),
	controllers = require(path.resolve(__dirname, "controllers"));

var development = function () {
		application.use(express.logger("dev"));
		application.use(express.errorHandler({
			dumpExceptions: true,
			showStack: true,
			showMessage: true 
		}));
	},
	production = function () {
		application.use(express.compress());
	},
	base = function () {
		application.use(helmet.xframe());
		application.use(helmet.iexss());
		application.use(helmet.contentTypeOptions());
		application.use(helmet.cacheControl());
		application.use(express.bodyParser());
		application.use(express.methodOverride());
		application.use("/" + config.server.static.destination, express.static(path.resolve(__dirname, "..", config.server.static.source)));
		application.use(express.cookieParser(config.server.cookie.secret));
		application.use(express.session({
			secret: config.server.cookie.secret,
			cookie: {
				httpOnly: config.server.cookie.http,
				secure: config.server.cookie.secure
			},
			store: new redis({
				host: config.databses.redis.host,
				port: config.databses.redis.port,
				pass: config.databses.redis.auth,
				no_ready_check: true,
				ttl: 60 * 60
			})
		}));
		application.use(express.csrf());
		application.use(application.router);
	};

application.set("env", config.server.process.environment);
application.set("view engine", "jade");
application.set("views", path.join(__dirname, "views"));

application.configure("development", development);
application.configure("production", production);
application.configure(base);

var route = function (path, routes, level) {
		
		var key,
			level = level || 0,
			keys = Object.keys(routes),
			i = keys.length - 1;

		while (i >= 0) {

			key = keys[i];

			if (typeof routes[key] === "function") {
				if (key === "index" && level === 0) application.get(path, routes[key]);
				else application.get(path + key, routes[key]);
			} else {
				route(path + key + "/", routes[key], level + 1);
			}

			i--;
		}
	};

route("/", controllers.routes);
route("/api/", controllers.api);
application.get("*", controllers.routes.index);

var server,
	http = require("http");

server = http.createServer(application).listen(config.server.environment[config.server.process.environment].port);