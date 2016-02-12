module.exports = function(ctx, env, opts, cb) {
	var value = env.getVariable(opts.variable, '');
	if (value.length > 0) {
		value += opts.separator;
	}
	value += opts.option;
	env.setVariable(opts.variable, value);
	setTimeout(cb, 0);
}
