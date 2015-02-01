module.exports = function(env) {

    env.defineFunctions({

        eq: function(lhs, rhs) {
            return lhs == rhs;
        },

        is: function(lhs, rhs) {
            return lhs === rhs;
        }

    });

}