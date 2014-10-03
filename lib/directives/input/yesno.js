var readline = require('readline');

module.exports = function(env) {

    function parse(v) {
        v = ('' + v).toLowerCase();
        if (v === 'yes' || v === 'y') {
            return 1;
        } else if (v === 'no' || v === 'n') {
            return 0;
        } else {
            return null;
        }
    }

    env.directive('get')
        .param('name', { required: true })
        .param('prompt')
        .param('default')
        .invoke(function(args, env, templatePath, cb) {

            var name = '' + args.name;
            var prompt = '' + (args.prompt || args.name);
            var defaultValue = parse(args.default);
            
            var rl = readline.createInterface({
                input   : process.stdin,
                output  : process.stdout
            });

            rl.setPrompt('');

            function ok(val) {
                rl.close();
                env.setVariable(name, val);
                cb();
            }

            (function run() {
                rl.question(prompt + ': [y/n] ', function(answer) {
                    answer = parse(answer.trim().toLowerCase());
                    if (answer === null) answer = defaultValue;
                    if (typeof answer === 'number') {
                        rl.close();
                        env.setVariable(name, answer);
                        return cb();
                    } else {
                        run();
                    }
                });
            })();

        });

};