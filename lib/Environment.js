var Directive = require('./Directive');

var Environment = module.exports = function() {
    this.variables = {};
    this.directives = {};
}

Environment.prototype.setVariable = function(key, value) {
    this.variables[key] = value;
}

Environment.prototype.getVariable = function(key) {
    if (!(key in this.variables)) {
        throw new Error("undefined variable: " + key);
    }
    return this.variables[key];
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

Environment.prototype.lookupDirective = function(name) {
    if (name in this.directives) {
        return this.directives[name];
    } else {
        throw new Error("no such directive: '" + name + "'");
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