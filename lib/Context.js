var Environment = require('./Environment');
var expressions = require('./expressions');
var types = require('./types');
var join = require('path').join;

module.exports = Context;

function Context(templatePath, targetPath) {
	this.rootEnvironment = createDefaultEnvironment();
	this.templatePath = templatePath;
	this.targetPath = targetPath;
}

Context.prototype.pathForTemplateFile = function(file) {
	return join(this.templatePath, file);
}

Context.prototype.pathForTargetFile = function(file) {
	return join(this.targetPath, file);
}

Context.prototype.makeCallback = function(env, cb) {
	if (typeof cb === 'function') {
		return cb;
	} else if (types.isPartialPipeline(cb)) {
		return function(value) {
			return expressions.evalPartialPipeline(env, cb, value);
		};
	} else {
		throw new Error("invalid callback: " + cb);
	}
}

function createDefaultEnvironment() {

	var env = new Environment();

	require('./functions/array')(env);
	require('./functions/compare')(env);
	require('./functions/math')(env);
	require('./functions/string')(env);

	env.defineDirectives(require('./directives'));
	
	return env;

}