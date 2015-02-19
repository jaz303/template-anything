var Environment = require('./Environment');
var expressions = require('./expressions');
var osenv = require('osenv');
var types = require('./types');
var join = require('path').join;
var resolve = require('path').resolve;
var basename = require('path').basename;
var fs = require('fs');

module.exports = Context;

function Context(templatePath, targetPath) {
	this.templatePath = templatePath;
	this.targetPath = targetPath;

	var env = this.rootEnvironment = createDefaultEnvironment();
	env.setVariable('TEMPLATE_PATH',	resolve(this.templatePath));
	env.setVariable('TARGET_PATH',		resolve(this.targetPath));
	env.setVariable('TARGET_NAME',		basename(env.getVariable('TARGET_PATH')));

	var defaultsPath = join(osenv.home(), '.ta', 'defaults.json');
	var defaults = {};
	try {
		defaults = JSON.parse(fs.readFileSync(defaultsPath, 'utf8'));
	} catch (e) {
		// do nothing
	}

	env.setVariable('defaults', types.makeDictionary(defaults));
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