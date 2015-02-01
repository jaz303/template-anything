var createDefaultEnvironment = require('./default_environment');
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