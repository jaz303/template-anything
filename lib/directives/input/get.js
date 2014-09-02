var readline = require('readline');

var Evaluator = require('../../Evaluator');

module.exports = function(env) {

    env.directive('get')
        .param('name', {
            required: true,
            symbol: true
        })
        .param('prompt')
        .param('default')
        .param('limit')
        .invoke(function(args, env, templatePath, cb) {

            // TODO: need to extract this
            var name = args.name.symbol;

            var rl = readline.createInterface({
                input   : process.stdin,
                output  : process.stdout
            });

            rl.setPrompt('');
            rl.question(name + ': ', function(answer) {
                rl.close();
                env.setVariable(name, answer);
                cb();
            });

        });

};