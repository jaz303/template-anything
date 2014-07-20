var ncp = require('ncp');

module.exports = function(env) {

    env.directive('copy')
        .param('src', {
            required: true
        })
        .param('dest')
        .invoke(function(args, env, cb) {

            if (!('dest' in args)) {
                args.dest = args.src;
            }

            ncp(args.src, args.dest, function(err) {
                if (err) return cb(err);
                cb(null);
            })
        
        });

};