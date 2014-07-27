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

	mkdirp(targetPath, function(err) {
		if (err) return;
		_readPlan();
	});

	var N = require('./lib/nodes');
	var Plan = require('./lib/Plan');
	var Environment = require('./lib/Environment');
	var Executor = require('./lib/Executor');

	var env = new Environment();
	require('./lib/directives')(env);

	function _readPlan() {
		var plan = new Plan();

		plan.inputs
			.add(new N.DirectiveCall('get', {
				positionalArgs: [new N.Symbol("module_name")]
			}));

		plan.script
			.add(new N.DirectiveCall('tree', {
				positionalArgs: []
			}))
			.add(new N.DirectiveCall('dir', {
				positionalArgs: [new N.String("foo/bar/baz")]
			}))
			.add(new N.DirectiveCall('template', {
				positionalArgs: [new N.String("Makefile")]
			}))
			.add(new N.DirectiveCall('copy', {
				positionalArgs: [new N.String("optional/.gitignore"), new N.String(".gitignore")]
			}))
			.add(new N.DirectiveCall('shell', {
				positionalArgs: [new N.String("git init && git add . && git commit -m 'initial'")]
			}))

		_runPlan(plan);
	}

	function _runPlan(plan) {
		var exec = new Executor();
		exec.run(plan, env, templatePath, targetPath);
	}

}