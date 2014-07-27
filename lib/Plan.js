var N = require('./nodes');

var Plan = module.exports = function() {
    this.inputs = new N.Inputs();
    this.script = new N.Script();
}
