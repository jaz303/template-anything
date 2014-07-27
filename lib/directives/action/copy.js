var fs = require('fs');

module.exports = function(env) {

    env.directive('copy')
        .param('file', {
            required: true
        })
        .param('dest', {
            required: true
        })
        .invoke(function(args, env, templatePath, cb) {

            var file = env.evalAsString(args.file);
            var dest = env.evalAsString(args.dest);
            var done = false;

            var r = fs.createReadStream(file);
            r.on('err', report);

            var w = fs.createWriteStream(dest);
            w.on('err', report);
            w.on('close', function() { report(); });

            r.pipe(w);

            function report(err) {
                if (!done) {
                    done = true;
                    cb(err);
                }
            }
            
        });

};