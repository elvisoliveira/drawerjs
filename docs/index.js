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

var csrf = function (request) {
		return (request.body && request.body._csrf) || (request.query && request.query._csrf) || (request.headers["x-csrf-token"]) || (request.headers["x-xsrf-token"]);
	};

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
		application.use(express.csrf({ value: csrf }));
		application.use(application.router);
	};

application.set("env", config.server.process.environment);
application.set("view engine", "jade");
application.set("views", path.join(__dirname, "views"));

application.configure("development", development);
application.configure("production", production);
application.configure(base);

var route = function (path, routes, level) {
		
		var key, type, handler,
			level = level || 0,
			keys = Object.keys(routes),
			i = keys.length - 1;

		while (i >= 0) {

			key = keys[i];

			if (routes[key].hasOwnProperty("handler") && typeof routes[key].handler === "function") {
					
				type = routes[key].type.toLowerCase();
				handler = routes[key].handler;

				if (key === "index" && level === 0) application[type](path, handler);
				else application[type](path + key, handler);
			} else {
				route(path + key + "/", routes[key], level + 1);
			}

			i--;
		}
	};

route("/", controllers.routes);
route("/api/", controllers.api);
application.get("*", controllers.routes.index.handler);

var server,
	http = require("http");

server = http.createServer(application).listen(config.server.environment[config.server.process.environment].port);