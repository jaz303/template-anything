var appendString = require('./append_string');

module.exports = function(ctx, env, opts, cb) {
	opts.string = ('' + opts.line) + "\n";
	return appendString(ctx, env, opts, cb);
}
