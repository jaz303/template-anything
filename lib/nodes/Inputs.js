var Inputs = module.exports = function() {
    this.steps = [];
}

Inputs.prototype.add = function(step) {
    this.steps.push(step);
    return this;
}