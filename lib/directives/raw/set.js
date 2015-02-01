module.exports = function(ctx, env, opts, cb) {

	if (typeof opts.name !== 'string') {
		return cb(new Error("name must be a string"));
	}

	// TODO(jwf): ensure opts.value is valid value?

	env.setVariable(opts.name, opts.value);
	cb();

}
