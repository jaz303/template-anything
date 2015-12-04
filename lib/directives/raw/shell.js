var parse = require('shell-quote').parse;
var spawn = require('child_process').spawn;

module.exports = function(ctx, env, opts, cb) {
    var args = parse(opts.command);
    var cmd = args.shift();

    var io = opts.echo
                ? ['ignore', process.stdout, process.stderr]
                : ['ignore', 'ignore', 'ignore'];

    var p = spawn(cmd, args, {
        cwd: opts.workingDirectory || ctx.targetPath,
        stdio: io
    });

    p.on('close', function(code) {
        if (code === 0) {
            return cb();
        } else {
            return cb(new Error("process exited with code " + code));
        }
    });
}
