var templatePath = require('./lib/template_path');
var gitClone = require('./lib/git_clone');

templatePath.resolve(process.argv[2], '.', function(err, template) {
	if (template.type === 'git') {
		gitClone(template.url, 'tmp', {}, function(err) {
			if (err) {
				console.error(err);
			} else {
				console.log("CLONED!");
			}
		});
	}
});
