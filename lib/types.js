var T = require('./ast_types');

exports.isValidValue = isValidValue;
function isValidValue(thing) {
	if (typeof thing === 'number' || typeof thing === 'string') {
		return true;
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