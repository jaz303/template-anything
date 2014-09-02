module.exports = Evaluator;

function Evaluator(env) {
	this.env = env;
}

Evaluator.prototype.eval = function(exp) {
	if (exp.type === 'ident') {
		return this.env.getVariable(exp.name);
	} else {
		throw new Error("unknown expression type!");
	}
}

Evaluator.prototype.asString = function(exp) {
	if (exp instanceof N.Symbol) return exp.symbol;
	if (exp === null || exp === void 0) return '';
	return '' + exp;
}
