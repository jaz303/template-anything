module.exports = function(env) {

    require('./input/get')(env);
    require('./input/set')(env);

    require('./action/tree')(env);

}