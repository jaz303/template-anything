var mkdirp = require('mkdirp');

module.exports = function(ctx, env, opts, cb) {
	var directoryPath = ctx.pathForTargetFile(opts.directoryName);
    mkdirp(directoryPath, function(err) {
        if (err) return cb(err);
        cb();
    });
}
