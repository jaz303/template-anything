var T = require('./ast_types');

exports.evaluate = evalExpression;
function evalExpression(env, node) {
    if (typeof node === 'string') {
        return node;
    } else if (node.type === T.INTERPOLATED_STRING) {
        return node.chunks.map(function(c) {
            return '' + evalExpression(env, c);
        }).join('');
    } else if (node.type === T.SYMBOL) {
        return node.name;
    } else if (node.type === T.PIPELINE) {
        return evalPipeline(env, node);
    } else if (node.type === T.CALL) {
        return evalFunctionCall(env, node);
    } else if (node.type === T.PREDICATE) {

    } else if (node.type === T.VARIABLE) {
        return env.getVariable(node.name);
    } else {
        throw new Error("can't evaluate expression: " + node.type);
    }
}

function evalPipeline(env, node) {

    var val = evalExpression(env, node.list[0]);

    for (var i = 1; i < node.list.length; ++i) {
        var call = node.list[i];

        val = doFunctionCallWithArgs(
            env,
            call.name,
            [args].concat(evalExpressionList(ctx, env, call.args))
        );
    }

    return val;

}

function evalFunctionCall(env, node) {
    return doFunctionCallWithArgs(
        env,
        node.name,
        evalExpressionList(env, node.args)
    )
}

function isTruthy(val) {
    return !(val === null || val === void 0 || val === '' || val === 0 || val === false);
}

function evalExpressionList(env, list) {
    return list.map(function(exp) {
        return evalExpression(env, exp);
    });
}

function doFunctionCallWithArgs(env, fn, args) {
    return env.lookupFunction(fn).apply(null, args);
}