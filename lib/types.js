var T = require('./ast_types');

exports.isValidValue = isValidValue;
function isValidValue(thing) {
	if (typeof thing === 'number' || typeof thing === 'string') {
		return true;
	} else if (typeof thing === 'object' && thing.type === T.DICTIONARY) {
		return true; // TODO: should probably check the entire structure?
	} else if (typeof thing === 'array') {
		return thing.every(isValidValue);
	}
}

exports.isPartialPipeline = isPartialPipeline;
function isPartialPipeline(thing) {
	return thing
		&& (typeof thing === 'object')
		&& thing.type === T.PARTIAL_PIPELINE;
}

exports.makeDictionary = makeDictionary;
function makeDictionary(object) {
	var dict = {};
	for (var k in object) {
		dict[k] = object[k];
	}
	return { type: T.DICTIONARY, dict: dict };
}