module.exports = function(env) {

    env.defineFunctions({

        random: function(min, max) {
            if (arguments.length === 0) {
                return Math.random();    
            } else if (arguments.length === 1) {
                return Math.floor(Math.random() * min);
            } else if (arguments.length === 2) {
                return min + Math.floor(Math.random() * (max - min));
            } else {
                throw new Error("random() expects 0, 1 or 2 arguments");
            }
        }

    });

}