var mkdirp = require('mkdirp');

module.exports = function(env) {

    env.directive('dir')
        .param('name', {
            required: true
        })
        .invoke(function(args, env, templatePath, cb) {

            var name = env.evalAsString(args.name);

            mkdirp(name, function(err) {
                if (err) return cb(err);
                cb();
            });
            
        });

};