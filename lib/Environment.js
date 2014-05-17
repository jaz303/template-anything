var Directive = require('./Directive');

var Environment = module.exports = function() {
    this.directives = {};
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