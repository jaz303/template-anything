var fs = require('fs');
var path = require('path');
var T = require('../../ast_types');

// TODO: extract
function toString(thing) {
	if (typeof thing === 'string' || typeof thing === 'number') {
		return JSON.stringify(thing);
	} else if (thing.type === T.DICTIONARY) {
		var out = '{';
		var ix = 0;
		for (var k in thing.dict) {
			if (ix++) out += ', ';
			out += k + ': ' + toString(thing.dict[k]);
		}
		out += '}';
		return out;
	} else if (thing.type === T.ARRAY) {
		var out = '[';
		var ix = 0;
		thing.elements.forEach(function(el) {
			if (ix++) out += ', ';
			out += toString(el);
		});
		out += ']';
		return out;
	} else {
		return '<unknown>';
	}
}

module.exports = function(ctx, env, opts, cb) {
	var message;
	if (typeof opts.message === 'object') {
		message = toString(opts.message);
	} else {
		message = '' + opts.message;
	}
	process.stdout.write(message + "\n");
	cb();
}
