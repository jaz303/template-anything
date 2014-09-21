var test = require('tape');
var expressions = require('../lib/expressions');
var parser = require('../lib/parser');
var Environment = require('../lib/Environment');

function parse(code) {
	return parser.parse(code, {startRule: 'ScriptExpression'});
}

test('literal - symbol', function(assert) {

	var env = new Environment();
	var ast = parse('/skeleton/bar.boof');
	var res = expressions.evaluate(env, ast);

	assert.equal(res, "/skeleton/bar.boof");
	assert.end();

});

test('literal - string', function(assert) {

	var env = new Environment();
	var ast = parse('"foobar"');
	var res = expressions.evaluate(env, ast);

	assert.equal(res, "foobar");
	assert.end();

});

test('variable', function(assert) {

	var env = new Environment();
	env.setVariable('name', 'Jason');

	var ast = parse('$name');
	var res = expressions.evaluate(env, ast);

	assert.equal(res, 'Jason');
	assert.end();

});

test('interpolated string', function(assert) {

	var env = new Environment();
	env.setVariable('name', 'John');

	var ast = parse('"{{ Hello }} {{ $name }}"');
	var res = expressions.evaluate(env, ast);

	assert.equal(res, 'Hello John');
	assert.end();

});

// clarify data types
// function call
// array
// predicate
// pipeline