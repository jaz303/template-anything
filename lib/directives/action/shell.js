var mkdirp = require('mkdirp');
var exec = require('child_process').exec;

module.exports = function(env) {

    env.directive('shell')
        .param('cmd', {
            required: true
        })
        .invoke(function(args, env, templatePath, cb) {

            var cmd = env.evalAsString(args.cmd);

            exec(cmd, function(err) {
                if (err) return cb(err);
                cb();
            })
            
        });

};