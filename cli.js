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
var Environment = require('./lib/Environment');
var evaluator = require('./lib/evaluator');

templatePath(template, '.', function(err, tp) {

	if (tp.type === 'local') {
		doTemplate(tp.path, target);
	}


	// tmp.dir({unsafeCleanup: true}, function(err, tmpDir) {
	// 	if (err) return;
	// 	doClone(tmpDir + '/clone');
	// });

	// function doClone(templateClonePath) {
	// 	clone(path.url, templateClonePath, {
	// 		shallow: true
	// 	}, function(err) {
	// 		if (err) return;
	// 		removeDotGit(templateClonePath);
	// 	});
	// }

	// function removeDotGit(templateClonePath) {

	// 	rimraf(templateClonePath + '/.git', function(err) {
	// 		if (err) return;
	// 		doTemplate(templateClonePath, target);
	// 	});

	// }

});

function doTemplate(templatePath, targetPath) {

	var planSource = 'tree';
	try {
		planSource = fs.readFileSync(path.join(templatePath, 'plan.tpl'), 'utf8');
	} catch (e) {
		// do nothing; use default source code
	}

	var plan;
	try {
		plan = parser.parse(planSource, {startRule: 'Script'});
	} catch (e) {
		console.error("error parsing plan!");
		return;
	}

	try {
		mkdirp.sync(targetPath);
	} catch (e) {
		console.error("couldn't create target directory: " + targetPath);
		return;
	}

	var env = new Environment();
	require('./lib/directives')(env);

	var context = new Context(env, templatePath, targetPath);

	evaluator.run(plan, context, function(err) {
		if (err) {
			console.error(err);
			console.error(err.stack);
		} else {
			console.log('all done');
		}
	});

}