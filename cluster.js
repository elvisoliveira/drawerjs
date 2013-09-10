/**
 * Server Initialization Script | Startup Application
 */

var Cluster = function (configuration, application, silent) {

	this.configuration = require(this.path.resolve(__dirname, "config.js"));
	this.application = this.path.resolve(__dirname, "docs");
	this.silent = this.configuration.server.state.development ? false : true;

	this.module.setupMaster({
		args: [JSON.stringify(configuration || this.configuration)],
		exec: application || this.application,
		silent: silent || this.silent
	});

	if (this.module.isMaster) this.start();
};

Cluster.prototype = {
	path: require("path"),
	os: require("os"),
	module:  require("cluster"),
	refork: function (worker, code) {
		if (code !== 0) this.module.fork();
	},
	start: function () {

		var i = this.os.cpus().length - 1;

		while (i >= 0) {
			this.module.fork();;
			i--;
		}

		this.module.on("exit", this.refork.bind(this));
	}
};

var cluster = new Cluster(false, false, true);