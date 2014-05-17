var readline = require('readline');

module.exports = function(env) {

    env.directive('get')
        .param('name', {
            required: true,
            match: /^[a-z_][a-zA-Z0-9_]*$/
        })
        .param('prompt')
        .param('default')
        .param('limit')
        .invoke(function(args, env, cb) {

            var rl = readline.createInterface({
                input   : process.stdin,
                output  : process.stdout
            });

            rl.setPrompt('');

            args.prompt.stringValue(env, function(prompt) {
                rl.question(prompt, function(answer) {
                    rl.close();
                    console.log("answer: " + answer);
                    // set args.name to answer in env
                    cb();
                });
            }); 
            
        });

};