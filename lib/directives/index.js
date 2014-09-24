module.exports = function(env) {

    require('./input/get')(env);
    require('./input/set')(env);
    require('./input/yesno')(env);

    require('./action/copy')(env);
    require('./action/dir')(env);
    require('./action/shell')(env);
    require('./action/template')(env);
    require('./action/tree')(env);

}