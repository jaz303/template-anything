var exec = require('child_process').exec;

module.exports = function(ctx, env, opts, cb) {
    var execOpts = {};

    var initialDir = process.cwd();
    process.chdir(ctx.targetPath);

	if (opts.workingDirectory) {
        execOpts.cwd = opts.workingDirectory;
    }

    exec(opts.command, execOpts, function(err) {
    	process.chdir(initialDir);
        if (err) return cb(err);
        cb();
    });
}
