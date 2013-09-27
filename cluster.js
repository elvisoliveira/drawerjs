/**
 * Server Initialization Script | Startup Application
 */

var cluster = require("cluster");

if (cluster.isMaster) {

	var os = require("os"),
		i = os.cpus().length - 1,
		restart = function (worker, code, signal) {		
			if (code !== 0) cluster.fork();
		};

	while (i >= 0) {
		cluster.fork();;
		i--;
	}

	cluster.on("exit", restart);
} else {
	require("./docs")(require("./config.js"));
}