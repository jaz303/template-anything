var fs          = require('fs');
var parser      = require('../../parser');
var Evaluator   = require('../../Evaluator');

module.exports = function(env) {

    env.directive('template')
        .param('file', {
            required: true
        })
        .invoke(function(args, env, templatePath, cb) {

            var file = env.evalAsString(args.file);

            fs.readFile(file, 'utf8', function(err, contents) {
                if (err) return cb(err);
                _processTemplate(contents, function(err, result) {
                    if (err) return cb(err);
                    fs.writeFile(file, result, function(err) {
                        if (err) return cb(err);
                        cb();
                    });
                });
            });

            function _processTemplate(tpl, cb) {

                var ev = new Evaluator(env);
                var buffer = '';
                
                parser.parse(tpl, {startRule: 'FileTemplate'}).forEach(function(chunk) {
                    if (typeof chunk === 'string') {
                        buffer += chunk;
                    } else {
                        buffer += ev.asString(ev.eval(chunk));
                    }
                });

                cb(null, buffer);

            }
            
        });

};