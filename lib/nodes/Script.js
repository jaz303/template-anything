var Script = module.exports = function() {
    this.steps = [];
}

Script.prototype.add = function(step) {
    this.steps.push(step);
    return this;
}