var expressions = require('./expressions');
var parser = require('./parser');

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
		} else {
			buffer += (expressions.evaluate(env, chunk) || '');
		}
	});
	return buffer;
}