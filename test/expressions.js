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

// clarify data types
// function call
// variable lookup
// array
// predicate
// pipeline
// interpolated string