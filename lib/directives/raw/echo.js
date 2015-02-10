var fs = require('fs');
var path = require('path');

module.exports = function(ctx, env, opts, cb) {
	process.stdout.write(opts.message + "\n");
	cb();
}
