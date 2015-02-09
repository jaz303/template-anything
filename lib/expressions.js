var T = require('./ast_types');

var isValidValue = require('./types').isValidValue;
var isPartialPipeline = require('./types').isPartialPipeline;

exports.isTruthy = isTruthy
function isTruthy(val) {
    if (val === void 0 || val === null) {
        throw new Error("assertion error: undefined and null are not valid values");
    }
    if (Array.isArray(val)) {
        return val.length > 0;
    } else if (val === '' || val === 0) {
        return false;
    } else {
        return true;
    }
}

exports.evaluate = evalExpression;
function evalExpression(env, node) {

    function lint(val) {
        if (isValidValue(val) || isPartialPipeline(val)) {
            return val;
        } else {
            throw new Error("lint failed: " + val + " is not a valid value");
        }
    }

    function perform() {
        if (typeof node === 'string' || typeof node === 'number') {
            return node;
        } else if (node.type === T.CALL) {
            return evalFunctionCall(env, node);
        } else if (node.type === T.SYMBOL) {
            return node.name;
        } else if (node.type === T.ARRAY) {
            return evalExpressionList(env, node.items);
        } else if (node.type === T.INTERPOLATED_STRING) {
            return node.chunks.map(function(c) {
                return '' + evalExpression(env, c);
            }).join('');
        } else if (node.type === T.VARIABLE) {
            return env.getVariable(node.name);
        } else if (node.type === T.PIPELINE) {
            return evalPipeline(env, node);
        } else if (node.type === T.PARTIAL_PIPELINE) {
            return node;
        } else {
            throw new Error("can't evaluate expression: " + node.type);
        }
    }

    return lint(perform());

}

function evalPipeline(env, node) {
    return evalPartialPipeline(env, node.pipeline, evalExpression(env, node.initial));
}

exports.pipe = evalPartialPipeline;
function evalPartialPipeline(env, node, val) {

    if (node.type !== T.PARTIAL_PIPELINE) {
        throw new Error("node is not a pipeline");
    }
    
    for (var i = 0; i < node.list.length; ++i) {
        var call = node.list[i];

        val = doFunctionCallWithArgs(
            env,
            call.name,
            [val].concat(evalExpressionList(env, call.args))
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

function evalExpressionList(env, list) {
    return list.map(function(exp) {
        return evalExpression(env, exp);
    });
}

function doFunctionCallWithArgs(env, fn, args) {
    var impl = env.getFunction(fn);
    if (typeof impl !== 'function') {
        throw new Error("no such function: " + fn);
    }
    return impl.apply(null, args);
}