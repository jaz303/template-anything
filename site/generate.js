
var fs = require('fs');
var index = require('./index');
var markdown = require('markdown').markdown;
var nav = "";
var template = fs.readFileSync(__dirname + '/template.htm', 'utf8');

index.forEach(function(section) {
	if (section.title) {
		nav += "<h2>" + section.title + "</h2>\n";
	}
	nav += "<ul>\n";
	section.pages.forEach(function(p) {
		nav += "<li><a href=''>" + p.title + "</a></li>\n";
	});
	nav += "</ul>\n";
});

index.forEach(function(section) {
	section.pages.forEach(function(page) {
		var content = fs.readFileSync(page.source, 'utf8');
		var html = markdown.toHTML(content);
		
		var page = template
					.replace('{{ content }}', html)
					.replace('{{ nav }}', nav);

		console.log(page);

	});
});