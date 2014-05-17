var FunctionCall = module.exports = function(name, opts) {
    this.name = name;
    this.positionalArgs = opts.positionalArgs || [];
    this.namedArgs = opts.namedArgs || {};
}