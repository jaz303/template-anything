module.exports = createDefaultEnvironment;

var Environment = require('./Environment');

function createDefaultEnvironment() {

	var env = new Environment();

	require('./functions/array')(env);
	require('./functions/compare')(env);
	require('./functions/math')(env);
	require('./functions/string')(env);

	env.defineDirectives(require('./directives'));
	
	return env;

}