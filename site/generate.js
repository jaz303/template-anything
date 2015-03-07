var fs = require('fs');
var index = require('./pages');
var marked = require('marked');
var template = fs.readFileSync(__dirname + '/template.htm', 'utf8');

var sourceFile = process.argv[2];
var outputFile = process.argv[3];
var baseUrl = process.argv[4] || '';

marked.setOptions({
	highlight: function(code, lang, callback) {
	    require('pygmentize-bundled')({ lang: lang, format: 'html' }, code, function(err, result) {
	    	if (err) {
	    		callback(err);
	    	} else {
	    		callback(null, result.toString());		
	    	}
	    });
	}
});

var nav = "";

index.forEach(function(section) {
	if (section.title) {
		nav += "<h2>" + section.title + "</h2>\n";
	}

	nav += "<ul>\n";
	
	section.pages.forEach(function(p) {
		nav += "<li><a href='" + baseUrl + p.url + "'>" + p.title + "</a></li>\n";
	});
	
	nav += "</ul>\n";

});

var content = fs.readFileSync(sourceFile, 'utf8');

marked(content, function(err, html) {
	if (err) throw err;
	var page = template
				.replace('{{ content }}', html)
				.replace('{{ nav }}', nav);

	fs.writeFileSync(outputFile, page, 'utf8');
});
