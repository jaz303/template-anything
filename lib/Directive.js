var Directive = module.exports = function() {
    this.params = {};
    this.paramNames = [];
}

Directive.prototype.param = function(name, options) {

    this.paramNames.push(name);

    this.params[name] = options;

    return this;

}

Directive.prototype.validate = function(positionalArgs, namedArgs) {

}

Directive.prototype.invoke = function(args) {

}