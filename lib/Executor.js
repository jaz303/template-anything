var Executor = module.exports = function() {
    
}

Executor.prototype.run = function(plan, ctx) {

    var initialDir = process.cwd();
    process.chdir(ctx.targetPath);

    var self = this;

    self._runList(plan.inputs.steps, env, ctx, function(err) {
        if (err) return _fail(err);
        self._runList(plan.script.steps, env, ctx, function(err) {
            if (err) return _fail(err);
            _ok();
        });
    });

    function _fail(err) {
        console.error(err);
        console.error(err.stack);
        process.chdir(initialDir);
    }

    function _ok() {
        console.log('all done');
        process.chdir(initialDir);
    }

}

Executor.prototype._runList = function(list, env, ctx, cb) {
    function next(ix) {
        if (ix === list.length) {
            cb();
        } else {
            var call = list[ix];
            try {
                var directive = env.lookupDirective(call.name);
                directive.run(
                    directive.resolveArgs(call.positionalArgs, call.namedArgs),
                    env,
                    ctx.templatePath,
                    function(err) {
                        if (err) {
                            cb(err);
                        } else {
                            next(ix + 1);
                        }
                    }
                );
            } catch (err) {
                cb(err);
                return;
            }
        }
    }
    process.nextTick(function() { next(0); });
}