var args = process.argv.slice(2);

var template = args[0];
var target = args[1];

if (!template || !target) {
	throw new Error("template/target are required");
}

var templatePath = require('./lib/template_path');
var clone = require('git-clone');
var tmp = require('tmp');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var fs = require('fs');
var path = require('path');
var parser = require('./lib/parser');

var Context = require('./lib/Context');

templatePath(template, '.', function(err, path) {

	tmp.dir({unsafeCleanup: true}, function(err, tmpDir) {
		if (err) return;
		doClone(tmpDir + '/clone');
	});

	function doClone(templateClonePath) {
		clone(path.url, templateClonePath, {
			shallow: true
		}, function(err) {
			if (err) return;
			removeDotGit(templateClonePath);
		});
	}

	function removeDotGit(templateClonePath) {

		rimraf(templateClonePath + '/.git', function(err) {
			if (err) return;
			doTemplate(templateClonePath, target);
		});

	}

});

function doTemplate(templatePath, targetPath) {

	var N = require('./lib/nodes');
	var Plan = require('./lib/Plan');
	var Environment = require('./lib/Environment');
	var Executor = require('./lib/Executor');

	var env = new Environment();
	require('./lib/directives')(env);

	var plan = null;

	_readPlan();

	function _readPlan() {
		fs.readFile(path.join(templatePath, 'plan.tpl'), 'utf8', function(err, src) {
			_parsePlan(err ? 'tree' : src);
		});
	}

	function _parsePlan(src) {
		try {
			plan = parser.parse(src, {startRule: 'Script'});
			_createTargetDir();
		} catch (e) {
			console.error("error parsing plan!");
		}
	}

	function _createTargetDir() {
		mkdirp(targetPath, function(err) {
			if (err) return;
			_runPlan();
		});
	}

	function _runPlan() {
		var exec = new Executor();
		exec.run(
			plan,
			new Context(env, templatePath, targetPath)
		);
	}

}