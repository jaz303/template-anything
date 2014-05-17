var Str = module.exports = function(string) {
    this.string = string;
}

Str.prototype.stringValue = function(env, cb) {
	cb(this.string);
}