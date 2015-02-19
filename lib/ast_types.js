//
// AST node types

exports.SECTION             = 1;
exports.DIRECTIVE           = 2;
exports.IF                  = 3;

exports.CALL                = 4;
exports.SYMBOL              = 5;
exports.ARRAY_LITERAL       = 6;
exports.DICTIONARY_LITERAL	= 7;
exports.INTERPOLATED_STRING = 8;
exports.VARIABLE			= 9;
exports.PIPELINE            = 10;
exports.PARTIAL_PIPELINE    = 11;
exports.STATIC_MEMBER		= 12;

//
// Runtime types

exports.DICTIONARY			= 128;
exports.ARRAY 				= 129;