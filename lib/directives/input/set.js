module.exports = function(env) {

    env.directive('set')
        .param('name', {
            required: true,
            match: /^[a-z_][a-zA-Z0-9_]*$/
        })
        .param('value', {
            required: true
        })
        .invoke(function(args, env, cb) {

            var name;

            // TODO: should probably just ensure args.name is ident
            function step1() {
                args.name.eval(env, function(err, n) {
                    if (err) {
                        cb(err);
                    } else {
                        name = n;
                        step2();
                    }
                });    
            }

            function step2() {
                args.value.eval(env, function(err, value) {
                    if (err) {
                        cb(err);
                    } else {
                        env.setVariable(name, value);
                        cb();
                    }
                });
            }

            step1();
            
        });

};