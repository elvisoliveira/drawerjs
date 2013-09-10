/**
 * Server Initialization Script | Startup Application
 */

var path = require("path"),
	cluster = require("cluster"),
	os = require("os");


/**
 * Cluster Configuration
 */

cluster.setupMaster({
	args: [JSON.stringify(require(path.resolve(__dirname, "config.js")))],
	exec: path.resolve(__dirname, "docs"),
	silent: false
});

if (cluster.isMaster) {

	var i = os.cpus().length - 1;

	while (i >= 0) {
		cluster.fork();;
		i--;
	}

	cluster.on("exit", function (worker, code) {		
		if (code !== 0) cluster.fork();
	});
}