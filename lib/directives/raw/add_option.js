module.exports = function(ctx, env, opts, cb) {
	var value = ctx.getVariable(opts.variable, '');
	if (value.length > 0) {
		value += opts.separator;
	}
	value += opts.option;
	ctx.setVariable(opts.variable, value);
	setTimeout(cb, 0);
}
