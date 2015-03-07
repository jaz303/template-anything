
var fs = require('fs');
var index = require('./pages');
var markdown = require('markdown').markdown;
var nav = "";
var template = fs.readFileSync(__dirname + '/template.htm', 'utf8');

index.forEach(function(section) {
	if (section.title) {
		nav += "<h2>" + section.title + "</h2>\n";
	}
	nav += "<ul>\n";
	
	section.pages.forEach(function(p) {

		p.sourcePath = 'content/' + p.source;
		p.outputPath = p.sourcePath
							.replace(/^content/, 'output')
							.replace(/\.md$/, '.htm');
		p.url = p.outputPath.replace(/^output\//, '');

		nav += "<li><a href='" + p.url + "'>" + p.title + "</a></li>\n";
	
	});
	
	nav += "</ul>\n";
});

index.forEach(function(section) {
	section.pages.forEach(function(p) {

		var content = fs.readFileSync(p.sourcePath, 'utf8');
		var html = markdown.toHTML(content);
		
		var page = template
					.replace('{{ content }}', html)
					.replace('{{ nav }}', nav);

		// TODO: mkdirp?
		fs.writeFileSync(p.outputPath, page, 'utf8');

	});
});