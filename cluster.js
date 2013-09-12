/**
 * Server Initialization Script | Startup Application
 */

if (process.env.NODETIME_ACCOUNT_KEY) require("nodetime").profile({ accountKey: process.env.NODETIME_ACCOUNT_KEY, appName: "drawerjs" });

var path = require("path"),
	cluster = require("cluster"),
	os = require("os");


cluster.setupMaster({
	args: [JSON.stringify(require(path.resolve(__dirname, "config.js")))],
	exec: path.resolve(__dirname, "docs"),
	silent: false
});


if (cluster.isMaster) {

	var i = os.cpus().length - 1,
		restart = function (worker, code) {		
			if (code !== 0) cluster.fork();
		};

	while (i >= 0) {
		cluster.fork();;
		i--;
	}

	cluster.on("exit", restart);
}