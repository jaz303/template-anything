var readline = require('readline');
var types = require('../../types');

function I(val) { return val; }
function Y(val) { return true; }

module.exports = function(ctx, env, opts, cb) {

    opts = opts || {};

    var varName = opts.varName;
    if (typeof varName !== 'string') {
        return cb(new Error("prompt varName must be provided and must be a string"));
    }

    var defaultValue = opts.defaultValue;

    if (defaultValue !== void 0) {
        defaultValue = '' + defaultValue;
    }
    
    var filterCb = ctx.makeCallback(env, opts.filter || I);

    var validateCb;
    if (Array.isArray(opts.validate)) {
        var validateChoices = opts.validate;
        validateCb = function(value) {
            return validateChoices.indexOf(value) >= 0;
        };
    } else {
        validateCb = ctx.makeCallback(env, opts.validate || Y);
    }
    
    var postFilterCb = ctx.makeCallback(env, opts.postFilter || I);

    var rl = readline.createInterface({
        input   : process.stdin,
        output  : process.stdout
    });

    rl.setPrompt('');

    var prompt = opts.prompt;
    if (!prompt) {
        prompt = varName + ': ';
    }
    if (typeof defaultValue === 'string') {
        prompt = prompt.trimRight();
        prompt += ' (default=' + defaultValue + ') ';
    }

    function call(cb, value) {
        if (types.isPartialPipeline(cb)) {
            return ctx.evaluatePartialPipeline(env, cb, value);
        } else {
            return cb(value);
        }
    }

    function filter(value) { return call(filterCb, value); }
    function validate(value) { return call(validateCb, value); }
    function postFilter(value) { return call(postFilterCb, value); }

    (function _read() {
        rl.question(prompt, function(answer) {
            if (answer.length === 0 && typeof defaultValue === 'string') {
                answer = defaultValue;
            }
            answer = filter(answer);
            if (!validate(answer)) {
                _read();
            } else {
                rl.close();
                env.setVariable(varName, postFilter(answer));
                cb();
            }
        });
    })();

}
