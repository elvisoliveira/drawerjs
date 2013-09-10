/**
 * Express Application Script
 */


var path = require("path"),
	express = require("express"),	
	helmet = require("helmet");

var application = module.exports = express(),
	config = JSON.parse(process.argv.splice(2));

var routes = require(path.resolve(__dirname, "controllers", "routes")),
	api = require(path.resolve(__dirname, "controllers", "api"));
	
var cluster = require("cluster"),
	worker = cluster.worker;


/**
 * Express Template Engine / Environment
 */

application.set("env", config.server.process.environment);
application.set("view engine", "jade");
application.set("views", path.join(__dirname, "views"));


/**
 * Express Development Configuration
 */

application.configure("development", function () {
	application.use(express.logger("development"));
	application.use(express.errorHandler({
		dumpExceptions: true,
		showStack: true
	}));
});


/**
 * Express Production Configuration
 */

application.configure("production", function () {
	application.use(express.errorHandler());
});


/**
 * Express Application Configuration
 */

application.configure(function () {


	/**
     * Safety Headers Middleware
     */

	application.use(helmet.xframe());
	application.use(helmet.iexss());
	application.use(helmet.contentTypeOptions());
	application.use(helmet.cacheControl());


	/**
	 * POST Request Handler Middleware
	 */

	application.use(express.bodyParser());
	application.use(express.methodOverride());


	/**
     * Static Assets
     */

	application.use("/" + config.server.static.destination, express.static(path.resolve(__dirname, "..", config.server.static.source)));


	/**
     * Cookie Middleware / CSRF Middleware
     */

	application.use(express.cookieParser(config.server.cookie.secret));
	application.use(express.session({
		secret: config.server.cookie.secret,
		cookie: {
			httpOnly: config.server.cookie.http,
			secure: config.server.cookie.secure
		}
	}));
	application.use(express.csrf());


	/**
	 * Jade Layout Data
	 */
	
	application.use(function (request, response, next) {
		response.locals = config;
		next();
	});


	/**
     * Routes Handler Middleware
     */

	application.use(application.router);
});


/**
 * API Handler
 */

application.get("/api/test", api.test);


/**
 * Routes Handler
 */

application.get("/", routes.index);
application.get("/partials/:name", routes.partials);
application.get("*", routes.index);


/**
 * Create Express Server
 */

var server,
	http = require("http");

server = http.createServer(application).listen(config.server.environment[config.server.process.environment].port);