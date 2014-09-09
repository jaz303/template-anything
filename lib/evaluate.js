var T = require('./ast_types');

exports.run = run;
function run(plan, ctx, cb) {

    var initialDir = process.cwd();
    process.chdir(ctx.targetPath);

    var self = this;

    function _list(name) {
        return plan.sections.reduce(function(all, section) {
            return section.name === name ? all.concat(section.body) : all;
        }, []);
    }

    evalSequence(ctx, ctx.rootEnv, _list('inputs'), function(err) {
        if (err) return _done(err);
        evalSequence(ctx, ctx.rootEnv, _list('actions'), function(err) {
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

exports.evalExpression = evalExpression;
function evalExpression(ctx, env, node) {
    if (typeof node === 'string') {
        return node;
    } else if (node.type === T.PIPELINE) {
        return evalPipeline(ctx, env, node);
    } else if (node.type === T.CALL) {
        return evalFunctionCall(ctx, env, node);
    } else if (node.type === T.PREDICATE) {

    } else {
        throw new Error("can't evaluate expression: " + node.type);
    }
}

exports.evalPipeline = evalPipeline;
function evalPipeline(ctx, env, node) {

    var val = evalExpression(ctx, env, node.list[0]);

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

exports.evalFunctionCall = evalFunctionCall;
function evalFunctionCall(ctx, env, node) {
    return doFunctionCallWithArgs(
        ctx,
        env,
        node.name,
        evalExpressionList(ctx, env, node.args)
    )
}

//
//

exports.evalIfStatement = evalIfStatement;
function evalIfStatement(ctx, env, node, cb) {
    try {
        var cond = isTruthy(evalExpression(ctx, env, node.cond));
        evalSequence(ctx, env, node[cond ? body : alt], cb);
    } catch (err) {
        cb(err);
    }
}

exports.evalSequence = evalSequence;
function evalSequence(ctx, env, list, cb) {
    _seq(ctx, env, evalDirective.bind, list, cb);
}

exports.evalDirective = evalDirective;
function evalDirective(ctx, env, node, cb) {
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
    return list.map(function(exp) {
        return evalExpression(ctx, env, exp);
    });
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