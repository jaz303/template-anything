var fs = require('fs');

module.exports = function(ctx, env, opts, cb) {
	fs.open(ctx.pathForTargetFile(opts.file), 'a', function(err, fd) {
		if (err) return cb(err);
		var buffer = new Buffer('' + opts.string);
		fs.write(fd, buffer, 0, buffer.length, null, function(err) {
			if (err) return cb(err);
			fs.close(fd);
			cb();
		})
	});
}
