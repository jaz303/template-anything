var exec = require('child_process').exec;

module.exports = function(ctx, env, opts, cb) {
    var execOpts = {};
    if (opts.workingDirectory) {
        execOpts.cwd = opts.workingDirectory;
    }

    exec(opts.command, execOpts, function(err) {
        if (err) return cb(err);
        cb();
    });
}
