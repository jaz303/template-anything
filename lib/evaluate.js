var T = require('./ast_types');
var expressions = require('./expressions');

exports.run = run;
function run(plan, ctx, cb) {

    var self = this;

    function _list(name) {
        return plan.reduce(function(all, section) {
            return section.name === name ? all.concat(section.body) : all;
        }, []);
    }

    evalSequence(ctx, ctx.rootEnvironment, _list('inputs'), function(err) {
        if (err) return _done(err);
        evalSequence(ctx, ctx.rootEnvironment, _list('actions'), function(err) {
            if (err) return _done(err);
            return _done(null);
        })
    });

    function _done(err) {
        cb(err);
    }

}

function evalSequence(ctx, env, list, cb) {
    (function next(ix) {
        if (ix === list.length) {
            return cb(null);
        }
        switch (list[ix].type) {
            case T.DIRECTIVE:
                evalDirective(ctx, env, list[ix], _done)
                break;
            case T.IF:
                evalIfStatement(ctx, env, list[ix], _done);
                break;
        }
        function _done(err) {
            if (err) return cb(err);
            next(ix + 1);
        }
    })(0);
}

function evalIfStatement(ctx, env, node, cb) {
    try {
        var condition = expressions.evaluate(env, node.condition);
        var truthy = expressions.isTruthy(condition);
        evalSequence(ctx, env, node[truthy ? 'consequent' : 'alternate'], cb);
    } catch (err) {
        cb(err);
    }
}

function evalDirective(ctx, env, node, cb) {
    
    var directive = env.getDirective(node.name);
    if (!directive) {
        return cb(new Error("no such directive: " + node.name));
    }

    try {
        var positionalArgs = node.args.positional.map(function(exp) {
            return expressions.evaluate(env, exp);
        });

        var namedArgs = {};
        for (var argName in node.args.named) {
            namedArgs[argName] = expressions.evaluate(env, node.args.named[argName]);
        }

        var resolvedArgs = directive.resolveArgs(positionalArgs, namedArgs);    
    } catch (err) {
        return cb(err);
    }
    
    directive.invoke(ctx, env, resolvedArgs, cb);

}