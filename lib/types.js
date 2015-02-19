var T = require('./ast_types');

exports.isValidValue = isValidValue;
function isValidValue(thing) {
	if (typeof thing === 'number'
		|| typeof thing === 'string'
		|| isArray(thing)
		|| isDictionary(thing)) {
		return true;
	}
	return false;
}

exports.isPartialPipeline = isPartialPipeline;
function isPartialPipeline(thing) {
	return thing
		&& (typeof thing === 'object')
		&& thing.type === T.PARTIAL_PIPELINE;
}

exports.isArray = isArray;
function isArray(object) {
	return object && object.type === T.ARRAY;
}

exports.isDictionary = isDictionary;
function isDictionary(object) {
	return object && object.type === T.DICTIONARY;
}

exports.makeDictionary = makeDictionary;
function makeDictionary(object) {
	var dict = {};
	for (var k in object) {
		dict[k] = object[k];
	}
	return { type: T.DICTIONARY, dict: dict };
}
