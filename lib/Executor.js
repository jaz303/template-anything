var T = require('./ast_nodes');

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

//
// Expressions - synchronous

Executor.prototype._evalExpression = function(ctx, env, node) {
    if (typeof node === 'string') {
        return node;
    } else if (node.type === T.PIPELINE) {
        return this._evalPipeline(ctx, env, node);
    } else if (node.type === T.CALL) {
        return this._evalFunctionCall(ctx, env, node);
    } else {
        throw new Error("can't evaluate expression: " + node.type);
    }
}

Executor.prototype._evalPipeline = function(ctx, env, node) {

    var val = this._evalExpression(ctx, env, node.list[0]);

    for (var i = 1; i < node.list.length; ++i) {
        var call = node.list[i];

        val = doFunctionCallWithArgs(
            ctx,
            env,
            call.name,
            [args].concat(evalExpressionList(ctx, env, call.args))
        );
    }

    return val;

}

Executor.prototype._evalFunctionCall = function(ctx, env, node) {
    return doFunctionCallWithArgs(
        ctx,
        env,
        node.name,
        evalExpressionList(ctx, env, node.args)
    )
}

//
//

Executor.prototype._evalIfStatement = function(ctx, env, node, cb) {
    try {
        var cond = isTruthy(this._evalExpression(ctx, env, node.cond));
        this._evalSequence(ctx, env, node[cond ? body : alt], cb);
    } catch (err) {
        cb(err);
    }
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

//
// Helpers

function doFunctionCallWithArgs(ctx, env, fn, args) {
    return env.lookupFunction(fn).apply(null, args);
}

function evalExpressionList(ctx, env, list) {
    return list.map(this._evalExpression.bind(this));
}

function isTruthy(val) {

}

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