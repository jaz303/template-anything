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
			if (expressions.evaluate(env, chunk.condition)) {
				buffer += evaluate(chunk.consequent, env);
			} else {
				buffer += evaluate(chunk.alternate, env);
			}
		} else {
			buffer += (expressions.evaluate(env, chunk) || '');
		}
	});
	return buffer;
}