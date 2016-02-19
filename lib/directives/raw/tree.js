var cpr = require('cpr');
var mkdirp = require('mkdirp');
var path = require('path');
var fs = require('fs');

module.exports = function(ctx, env, opts, cb) {

	var src = ctx.pathForTemplateFile(opts.sourceDirectory);
	var dest = ctx.pathForTargetFile(opts.targetDirectory);

	try {
		if (!fs.statSync(src).isDirectory()) {
			return cb(new Error("[tree] source is not a directory"));
		}
	} catch (e) {
		// TODO(jwf): better error message?
		return cb(e);
	}

	try {
		if (!fs.statSync(dest).isDirectory()) {
			return cb(new Error("[tree] destination exists but is not a directory"));
		}
	} catch (e) {
		// do nothing; dest not exist. we're cool with that.
	}

	mkdirp(dest, function(err) {
	    if (err) return cb(err);
	    cpr(src, dest, { overwrite: true }, function(err) {
	        if (err) return cb(err);
	        cb();
	    })
	});

}
