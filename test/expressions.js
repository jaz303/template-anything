var test = require('tape');
var expressions = require('../lib/expressions');
var parser = require('../lib/parser');
var Environment = require('../lib/Environment');
var T = require('../lib/ast_types');

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

test('function call', function(assert) {

	var env = new Environment();
	env.setFunction('downcase', function(str) {
		return str.toLowerCase();
	});

	var ast = parse('downcase("FOO")');
	var res = expressions.evaluate(env, ast);

	assert.equal(res, 'foo');
	assert.end();

});

test("function call - complex", function(assert) {

	var env = new Environment();

	env.setVariable('subject', 'FOOBAR');

	env.setFunction('repeat', function(str, count, join) {
		var out = [];
		while (count--) {
			out.push(str);
		}
		return out.join(join);
	});
	
	env.setFunction('downcase', function(str) {
		return str.toLowerCase();
	});

	env.setFunction('substr', function(str, start) {
		return str.substr(start);
	});

	var ast = parse('repeat(downcase(substr($subject, 3)), 2, " - ")');
	var res = expressions.evaluate(env, ast);

	assert.equal(res, 'bar - bar');
	assert.end();

});

test("array", function(assert) {

	var env = new Environment();

	var ast = parse('[1,2,3]');
	var res = expressions.evaluate(env, ast);

	assert.deepEqual(res, { type: T.ARRAY, elements: [1,2,3] });
	assert.end();

});

test("pipeline", function(assert) {

	var env = new Environment();

	env.setVariable('name', 'JASON');

	env.setFunction('prepend', function(str, prefix) {
		return '' + prefix + str;
	});

	env.setFunction('downcase', function(str) {
		return ('' + str).toLowerCase();
	});

	var ast = parse('$name | prepend("HELLO ") | downcase()');
	var res = expressions.evaluate(env, ast);

	assert.equal(res, "hello jason");
	assert.end();

});

test("partial pipeline", function(assert) {

	var env = new Environment();

	env.setFunction('downcase', function(str) {
		return str.toLowerCase();
	});

	var ast = parse('| downcase()');

	assert.equal(ast, expressions.evaluate(env, ast));

	var res = expressions.evalPartialPipeline(env, ast, 'HELLO');
	assert.equal(res, 'hello');

	assert.end();

});