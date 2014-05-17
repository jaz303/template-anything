var Directive = module.exports = function(name) {
	this.name = name;
    this.params = {};
    this.positions = [];
    this.fn = null;
}

Directive.prototype.param = function(name, options) {

    this.positions.push(name);

    this.params[name] = options;

    return this;

}

Directive.prototype.invoke = function(fn) {
	this.fn = fn;
	return this;
}

Directive.prototype.resolveArgs = function(positional, named) {

	if (positional.length > this.positions.length) {
		throw new Error("directive '" + this.name + "' accepts a maximum of " + this.positions.length + " arguments");
	}

	var out = {};

	for (var i = 0; i < positional.length; ++i) {
		out[this.positions[i]] = positional[i];
	}

	for (var k in named) {
		if (!(k in this.params)) {
			throw new Error("directive '" + this.name + "', no such parameter: '" + k + "'");
		}
		out[k] = named[k];
	}

	return out;

}

Directive.prototype.run = function(args, env, cb) {
	this.fn(args, env, cb);
}