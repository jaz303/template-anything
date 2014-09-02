var Executor = module.exports = function() {
    
}

Executor.prototype.run = function(plan, ctx, cb) {

    var initialDir = process.cwd();
    process.chdir(ctx.targetPath);

    var self = this;

    function _list(name) {
        return plan.sections.reduce(function(all, section) {
            return section.name === name ? all.concat(section.body) : all;
        }, []);
    }

    self._evalSequence(ctx, ctx.rootEnv, _list('inputs'), function(err) {
        if (err) return _done(err);
        self._evalSequence(ctx, ctx.rootEnv, _list('actions'), function(err) {
            if (err) return _done(err);
            _done(null);
        })
    });

    function _done(err) {
        process.chdir(initialDir);
        cb(err);
    }

}

Executor.prototype._evalPipeline = function(ctx, env, node, cb) {

}

Executor.prototype._evalExpression = function(ctx, env, node, cb) {
    if (typeof node === 'string') {
        cb(null, node);
    } else {
        cb(new Error("can't expression! :("));
    }
}

Executor.prototype._evalFunctionCall = function(ctx, env, node, cb) {

}

Executor.prototype._evalIfStatement = function(ctx, env, node, cb) {
    var self = this;
    this._evalExpression(ctx, env, node.cond, function(err, res) {
        if (err) return cb(err);
        if (this._isTruthy(res)) {
            this._evalSequence(ctx, env, node.body, cb);
        } else {
            this._evalSequence(ctx, env, node.alt, cb);
        }
    });
}

Executor.prototype._evalSequence = function(ctx, env, list, cb) {
    _seq(ctx, env, this._evalDirective.bind(this), list, cb);

    // function next(ix) {
    //     if (ix === list.length) {
    //         cb();
    //     } else {
    //         var call = list[ix];
    //         try {
    //             var directive = env.lookupDirective(call.name);
    //             directive.run(
    //                 directive.resolveArgs(call.positionalArgs, call.namedArgs),
    //                 env,
    //                 ctx.templatePath,
    //                 function(err) {
    //                     if (err) {
    //                         cb(err);
    //                     } else {
    //                         next(ix + 1);
    //                     }
    //                 }
    //             );
    //         } catch (err) {
    //             cb(err);
    //             return;
    //         }
    //     }
    // }
    // process.nextTick(function() { next(0); });
}

Executor.prototype._evalDirective = function(ctx, env, node, cb) {
    var directive = env.lookupDirective(node.name);
    if (!directive) return cb(new Error("no such directive: " + node.name));
    directive.run(node.args, env, ctx.templatePath, cb);
}

Executor.prototype._evalExpressionList = function(ctx, env, list, cb) {
    _map(ctx, env, this._evalExpression.bind(this), list, cb);
}

Executor.prototype._evalFunctionCall = function(ctx, env, node, cb) {
    var self = this;
    this._evalExpressionList(node.args, function(err, args) {
        if (err) return cb(err);
        this._performFunctionCall(ctx, env, node.name, args, cb);
    });
}

Executor.prototype._performFunctionCall = function(ctx, env, fn, args, cb) {
    fn = env.getFunction(fn);
    if (!fn) return cb(new Error("unknown function: " + fn));
    args = args.slice(0);
    args.push(cb);
    fn.apply(null, args);
}

//
// Helpers

function _seq(ctx, env, fn, ary, cb) {
    _map(ctx, env, fn, ary, function(err, res) {
        if (err) return cb(err);
        cb();
    });
}

function _map(ctx, env, fn, ary, cb) {
    var out = [];
    (function next(ix) {
        if (ix === ary.length) return cb(null, out);
        fn(ctx, env, ary[ix], function(err, res) {
            if (err) return cb(err);
            out.push(res);
            next(ix+1);
        });
    })(0);
}