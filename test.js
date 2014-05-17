var N = require('./lib/nodes');
var Directive = require('./lib/Directive');
var Plan = require('./lib/Plan');
var Environment = require('./lib/Environment');

var env = new Environment();

env.directive('get')
	.param('name')
	.param('prompt')
	.param('default')
	.param('limit');

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
