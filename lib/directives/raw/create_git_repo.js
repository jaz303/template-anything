var shell = require('./shell');
var expressions = require('../../expressions');

module.exports = function(ctx, env, opts, cb) {

	// REVIEW(jwf): should ALL directives support "if"?
	// if (('if' in opts) && !expressions.isTruthy(opts['if'])) {
	// 	return cb();
	// }

	var command = "git init";
	if (('commit' in opts) && expressions.isTruthy(opts.commit)) {
		var commitMsg = 'First commit';
		if (typeof opts.commit === 'string') {
			commitMsg = opts.commit;
		}
		// TODO(jwf): need to escape commitMsg
		command += " && git add . && git commit -m '" + commitMsg + "'";
	}

	shell(ctx, env, { command: command }, cb);
	
}
