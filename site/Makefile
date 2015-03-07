BASE_URL 	?= 
CONTENT_DIR	:= content
OUTPUT_DIR 	:= output

MARKDOWN 	:= $(shell find $(CONTENT_DIR) -name '*.md')
HTML 		:= $(patsubst $(CONTENT_DIR)/%.md, $(OUTPUT_DIR)/%.htm, $(MARKDOWN))

all: output output/main.css copy_assets html

define define_generator
$(2): $(1) pages.js template.htm
	@mkdir -p $$(@D)
	node generate.js $$< $$@ $(BASE_URL)
endef

$(foreach \
	md, \
	$(MARKDOWN), \
	$(eval $(call \
				define_generator, \
				$(md), \
				$(patsubst $(CONTENT_DIR)/%.md, $(OUTPUT_DIR)/%.htm, $(md)))))

html: $(HTML)

output:
	mkdir -p output

output/main.css: scss/main.scss output
	scss $< $@

copy_assets: output
	cp -R assets/* output

clean:
	rm -rf $(OUTPUT_DIR)

.PHONY: copy_assets clean html