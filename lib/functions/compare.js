module.exports = function(env) {

    env.defineFunctions({

        eq: function(lhs, rhs) {
            return (lhs == rhs) ? 1 : 0;
        },

        is: function(lhs, rhs) {
            return (lhs === rhs) ? 1 : 0;
        }

    });

}