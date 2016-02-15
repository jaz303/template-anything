var fs = require('fs');
var index = require('./pages');
var marked = require('marked');
var cheerio = require('cheerio');
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

	var urlChunks = outputFile.split('/');
	urlChunks.shift();
	var thisPageUrl = urlChunks.join('/');
	thisPageUrl = thisPageUrl.replace(/\.\w+$/, '');
	
	section.pages.forEach(function(p) {
		nav += "  <li>\n";
		nav += "    <a href='" + baseUrl + p.url + ".htm'>" + p.title + "</a>\n";
		if (p.url === thisPageUrl) {
			nav += "    {{ subnav }}\n";
		}
		nav += "  </li>\n";
	});
	
	nav += "</ul>\n";

});

var content = fs.readFileSync(sourceFile, 'utf8');

marked(content, function(err, html) {
	if (err) throw err;

	var subnav = "";
	var doc = cheerio.load('<div>' + html + '</div>');
	
	var titles = doc('h2');
	if (titles.length) {
		subnav += "<ul class='subnav'>\n";
		titles.each(function() {
			var subtitle = doc(this);
			subnav += "  <li><a href='#" + subtitle.attr('id') + "'>" + subtitle.text() + "</a></li>\n";
		});
		subnav += "</ul>";
	}

	var page = template
				.replace('{{ content }}', html)
				.replace('{{ nav }}', nav)
				.replace('{{ subnav }}', subnav);

	fs.writeFileSync(outputFile, page, 'utf8');
});
