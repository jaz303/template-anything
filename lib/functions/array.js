module.exports = function(env) {

    env.defineFunctions({

        join: function(ary, str) {
            return ary.join(str || '');
        }

    });

}