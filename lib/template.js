var expressions = require('./expressions');
var parser = require('./parser');
var T = require('./ast_types');

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
				_append(env, chunk.consequent);
			} else {
				_append(env, chunk.alternate);
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
					_append(loopEnv, chunk.body);
				});
			} else if (types.isDictionary(subject)) {
				for (var k in subject.dict) {
					loopEnv.setVariable(chunk.value, subject.dict[k]);
					if (chunk.key) loopEnv.setVariable(chunk.key, k);
					_append(loopEnv, chunk.body);
				}
			}
		} else {
			_append(env, chunk);
		}
	});

	return buffer;

	function _append(env, chunk) {
		buffer += (expressions.evaluate(env, chunk) || '');
	}
}
