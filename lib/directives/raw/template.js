var compileCache = {};

var fs = require('fs');
var template = require('../../template');

function getTemplate(file) {
	return template.compile(fs.readFileSync(file, 'utf8'));
}

function getTemplateFromCache(file) {
	return compileCache[file] || (compileCache[file] = getTemplate(file));
}

module.exports = function(ctx, env, opts, cb) {
	try {

		var templatePath, outputPath, compiledTemplate;

		if (opts.inplacePath) {
			templatePath = outputPath = ctx.pathForTargetFile(opts.inplacePath);
			compiledTemplate = getTemplate(templatePath);
		} else {
			templatePath = ctx.pathForTemplateFile(opts.templatePath);
			outputPath = ctx.pathForTargetFile(opts.outputPath);
			compiledTemplate = getTemplateFromCache(templatePath);
		}

		var result = template.evaluate(compiledTemplate, env);

		fs.writeFileSync(outputPath, result, 'utf8');

		setTimeout(function() {
			cb();
		}, 0);

	} catch (err) {
		return cb(err);
	}
}