var Environment = module.exports = function() {
    this.variables = {};
    this.functions = {};
    this.directives = {};
}

Environment.prototype.getVariable = function(key) {
    return this.variables[key];
}

Environment.prototype.setVariable = function(key, value) {
    this.variables[key] = value;
}

Environment.prototype.getFunction = function(key) {
    return this.functions[key];
}

Environment.prototype.setFunction = function(key, fn) {
    this.functions[key] = fn;
}

Environment.prototype.defineFunctions = function(fns) {
    for (var k in fns) {
        this.functions[k] = fns[k];
    }
}

Environment.prototype.getDirective = function(name) {
	return this.directives[name];
}

Environment.prototype.defineDirectives = function(ds) {
	for (var k in ds) {
		this.directives[k] = ds[k];
	}
}