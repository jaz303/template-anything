var N = require('./lib/nodes');
var Directive = require('./lib/Directive');
var Plan = require('./lib/Plan');
var Environment = require('./lib/Environment');
var Executor = require('./lib/Executor');

var env = new Environment();


var readline = require('readline');

env.directive('get')
	.param('name')
	.param('prompt')
	.param('default')
	.param('limit')
	.invoke(function(args, env, cb) {

		var rl = readline.createInterface({
			input 	: process.stdin,
			output	: process.stdout
		});

		rl.setPrompt('');

		args.prompt.stringValue(env, function(prompt) {
			rl.question(prompt, function(answer) {
				rl.close();
				console.log("answer: " + answer);
				cb();
			});
		});	
		
	});

var plan = new Plan();

plan.inputs
	.add(new N.DirectiveCall('get', {
		positionalArgs: [
			new N.Symbol('project_title')
		],
		namedArgs: {
			prompt: new N.String('Project title: ')
		}
	}))
	.add(new N.DirectiveCall('get', {
		positionalArgs: [
			new N.Symbol('module_name')
		],
		namedArgs: {
			prompt: new N.String('Module name: '),
			default: new N.Chain([
				new N.Symbol('project_title'),
				new N.Symbol('underscore'),
				new N.FunctionCall('replace', {
					positionalArgs: [
						new N.String('_'),
						new N.String('-')
					]
				})
			])
		}
	}));

var exec = new Executor();

exec.run(plan, env);