/**
 * Master Process
 */

var cluster = require("cluster");

cluster.setupMaster({
	exec: "docs"
});

if (cluster.isMaster) {

	var os = require("os"),
		cpus = os.cpus().length - 1;

	while (cpus >= 0) {
		cluster.fork();
		cpus--;
	}
}