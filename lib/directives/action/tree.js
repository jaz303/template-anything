var ncp = require('ncp');
var mkdirp = require('mkdirp');
var path = require('path');

module.exports = function(env) {

    env.directive('tree')
        .param('src')
        .param('dest')
        .invoke(function(args, env, templatePath, cb) {

            var src = env.evalAsString(args.src, ".");
            src = path.join(templatePath, src);

            var dest = env.evalAsString(args.dest, ".");

            mkdirp(dest, function(err) {
                if (err) return cb(err);
                ncp(src, dest, function(err) {
                    if (err) return cb(err);
                    cb();
                })
            });
        
        });

};