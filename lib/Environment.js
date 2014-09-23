var Directive = require('./Directive');

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

Environment.prototype.directive = function(directive) {

    var name;

    if (typeof directive === 'string') {
        name = directive;
        directive = null;
    } else {
        name = directive.name;
    }

    name = this._filterDirectiveName(name);
    
    if (!directive) {
        directive = new Directive(name);
    }
    
    this.directives[name] = directive;

    return this.directives[name];

}

Environment.prototype.evalAsString = function(thing, defaultValue) {
    if (thing instanceof N.Symbol) {
        return thing.symbol;
    } else if (thing instanceof N.String) {
        return thing.string;
    } else if (typeof thing === 'undefined' && defaultValue) {
        return defaultValue;
    } else {
        throw new Error("can't eval: " + thing);
    }
}

Environment.prototype.lookupDirective = function(name) {
    if (name in this.directives) {
        return this.directives[name];
    } else {
        throw new Error("no such directive: " + name);
    }
}

Environment.prototype._filterDirectiveName = function(name) {

    name = '' + name;

    if (!name) {
        throw new Error("directive cannot have a blank name");
    }

    if (name in this.directives) {
        throw new Error("duplicate directive: " + name);
    }

    return name;

}