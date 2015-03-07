all: output/main.css copy_assets generate_content

output:
	mkdir -p output

output/main.css: scss/main.scss output
	scss $< $@

copy_assets: output
	cp -R assets/* output

generate_content:
	node generate.js

clean:
	rm -rf output

.PHONY: copy_assets clean