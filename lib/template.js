var expressions = require('./expressions');
var parser = require('./parser');
var T = require('./ast_types');
var types = require('./types');

exports.compile = compile;
function compile(templateSource) {
	return parser.parse(templateSource, {startRule: 'FileTemplate'});
}

exports.evaluate = evaluate;
function evaluate(compiledTemplate, env) {
	var buffer = '';
	compiledTemplate.forEach(function(chunk) {
		if (typeof chunk === 'string') {
			buffer += chunk;
		} else if (chunk.type === T.TEMPLATE_IF) {
			var cond = expressions.evaluate(env, chunk.condition);
			if (expressions.isTruthy(cond)) {
				buffer += evaluate(chunk.consequent, env);
			} else {
				buffer += evaluate(chunk.alternate, env);
			}
		} else if (chunk.type === T.TEMPLATE_FOREACH) {
			var subject = expressions.evaluate(env, chunk.subject);
			var loopEnv = env.beget();
			loopEnv.defineVariable(chunk.value, '');
			if (chunk.key) loopEnv.defineVariable(chunk.key, '');
			if (types.isArray(subject)) {
				subject.elements.forEach(function(item, ix) {
					loopEnv.setVariable(chunk.value, item);
					if (chunk.key) loopEnv.setVariable(chunk.key, ix);
					buffer += evaluate(chunk.body, loopEnv);
				});
			} else if (types.isDictionary(subject)) {
				for (var k in subject.dict) {
					loopEnv.setVariable(chunk.value, subject.dict[k]);
					if (chunk.key) loopEnv.setVariable(chunk.key, k);
					buffer += evaluate(chunk.body, loopEnv);
				}
			}
		} else {
			// TODO: review this
			var res = expressions.evaluate(env, chunk);
			if (typeof res === undefined || res === null) res = '';
			buffer += res;
		}
	});

	return buffer;
}
