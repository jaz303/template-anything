var Environment = module.exports = function() {
    this.parent = null;
    this.variables = {};
    this.functions = {};
    this.directives = {};
}

Environment.prototype.beget = function() {
    var child = new Environment();
    child.parent = this;
    child.functions = this.functions;
    child.directives = this.directives;
    return child;
}

Environment.prototype.defineVariable = function(key, initialValue) {
    if (key in this.variables) {
        throw new Error("already defined: " + key);
    }
    this.variables[key] = initialValue;
}

Environment.prototype.getVariable = function(key, defaultValue) {
    var env = lookupVariable(this, key);
    if (env) {
        return env.variables[key];
    } else {
        return defaultValue;
    }
}

Environment.prototype.setVariable = function(key, value) {
    var env = lookupVariable(this, key);
    if (env) {
        env.variables[key] = value;
    } else {
        this.variables[key] = value;
    }
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

function lookupVariable(env, name) {
    while (env) {
        if (name in env.variables) {
            return env;
        } else {
            env = env.parent;
        }
    }
    return null;
}