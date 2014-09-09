var fs = require('fs');

var options = require('docopt').docopt(fs.readFileSync(__dirname + '/usage.txt', 'utf8'), {
    help        : true,
    version     : require('./package.json').version
});

if (options['<template>'] && options['<target>']) {
    require('./lib/run_template')(options['<template>'], options['<target>'], function(err) {
        if (err) {
            process.stderr.write(err.message + "\n");
            process.exit(1);
        }
    });
}
