var mkdirp = require('mkdirp');

module.exports = function(env) {

    env.directive('dir')
        .param('name', {
            required: true
        })
        .invoke(function(args, env, cb) {

            mkdirp(args.name, function(err) {
                if (err) return cb(err);
                cb(null);
            });
            
        });

};