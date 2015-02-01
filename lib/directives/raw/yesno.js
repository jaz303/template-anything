var prompt = require('./prompt');

module.exports = function(ctx, env, opts, cb) {

    var p = opts.prompt;
    if (!p) {
        p = opts.varName + '?';
    }
    p = p.trimRight();
    p += ' (y/n) ';

    var defaultValue = opts.defaultValue;
    if (defaultValue === 1 || defaultValue === '1') {
        defaultValue = 'yes';
    } else if (defaultValue === 0 || defaultValue === '0') {
        defaultValue = 'no';
    } else {
        defaultValue = void 0;
    }

    prompt(ctx, env, {
        varName: opts.varName,
        defaultValue: defaultValue,
        prompt: p,
        filter: function(answer) {
            return answer.trim().toLowerCase()
        },
        validate: ['y', 'yes', 'n', 'no'],
        postFilter: function(answer) {
            return answer.charAt(0) === 'y' ? 1 : 0;
        }
    }, cb);

}
