var fs = require('fs');
var path = require('path');

module.exports = function(ctx, env, opts, cb) {
	var sourcePath = ctx.pathForTemplateFile(opts.sourcePath);
	var destinationPath = ctx.pathForTargetFile(opts.destinationPath);
	var done = false;

	var rs = fs.createReadStream(sourcePath);
	rs.on('error', report);

	var ws = fs.createWriteStream(destinationPath);
	ws.on('error', report);
	ws.on('close', function() { report(); });

	rs.pipe(ws);

	function report(err) {
		if (!done) {
			done = true;
			cb(err);
		}
	}
}
