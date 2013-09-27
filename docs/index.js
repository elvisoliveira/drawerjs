/**
 * Export Express HTTP Instance
 */

var path = require("path"),
	express = require("express"),	
	helmet = require("helmet");

var application = module.exports = express(),
	redis = require("connect-redis")(express);

var controllers = require(path.resolve(__dirname, "controllers"));

//console.log(controllers);

module.exports = function (config) {

		

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
		general = function () {


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
		};

	application.set("env", config.server.process.environment);
	application.set("view engine", "jade");
	application.set("views", path.join(__dirname, "views"));
	application.configure("development", development);
	application.configure("production", production);
	application.configure(general);

	

	application.get("/", controllers.routes.index);
	application.get("/partials/index", controllers.routes.partials.index);
	application.get("/partials/documentation/amd", controllers.routes.partials.documentation.amd);
	application.get("/partials/documentation/api", controllers.routes.partials.documentation.api);
	application.get("/partials/documentation/jquery", controllers.routes.partials.documentation.jquery);
	application.get("/partials/documentation/options", controllers.routes.partials.documentation.options);
	application.get("/partials/documentation/usage", controllers.routes.partials.documentation.usage);
	application.get("/partials/installation/bower", controllers.routes.partials.installation.bower);
	application.get("/partials/installation/source", controllers.routes.partials.installation.source);
	application.get("/partials/compatibility/methods", controllers.routes.partials.compatibility.methods);
	application.get("/partials/compatibility/support", controllers.routes.partials.compatibility.support);
	application.get("/partials/bugs/requests", controllers.routes.partials.bugs.requests);
	application.get("/partials/bugs/report", controllers.routes.partials.bugs.report);
	application.get("*", controllers.routes.index);


	return require("http").createServer(application).listen(config.server.environment[config.server.process.environment].port);	
};