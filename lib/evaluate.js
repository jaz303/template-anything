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
    if (!directive) {
        return cb(new Error("no such directive: " + node.name));
    }

    // populate argNodes with map of arg name => AST expressions
    var argNodes;
    try {
        argNodes = directive.resolveArgs(node.args.positional, node.args.named);    
    } catch (err) {
        return cb(err);
    }
    
    // now evaluate all of the args
    var args = {};
    try {
        for (var k in argNodes) {
            args[k] = evalExpression(ctx, env, argNodes[k]);
        }    
    } catch (err) {
        return cb(err);
    }
    
    directive.run(args, env, ctx.templatePath, cb);

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