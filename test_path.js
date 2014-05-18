var templatePath = require('./lib/template_path');

templatePath.resolve(process.argv[2], '.', function(err, template) {
	console.log(template);
});
