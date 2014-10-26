SRC=src
DIST=dist
CONF=$(SRC)/config.json
LESSCFLAGS=-O2 --no-ie-compat --no-js --strict-imports --strict-math=on -rp=$(SRC)/ -x --clean-css
HTMLMINIFIERFLAGS=--remove-comments --collapse-whitespace --minify-js

pre-commit: beautify fix test dist
test: lint # style-check
fix: fix-js
fix-js:
	find $(SRC) \( -path $(SRC)/less -o -path $(SRC)/js/libs \) -prune -a -type f -o -name "*.js" -or -name "*.json" | xargs -n 1 fixmyjs -c .jshintrc || true
lint: lint-js lint-json
lint-json:
	ls .jsbeautifyrc .jshintrc .jscsrc package.json | xargs -n 1 jsonlint -ip
	find $(SRC) -name "*.json" | xargs -n 1 jsonlint -ip
lint-js:
	jshint $(SRC)
beautify: beautify-html # beautify-js
beautify-js:
	find $(SRC) \( -path $(SRC)/js/libs -o -path $(SRC)/less \) -prune -a -type f -o -name "*.js" -or -name "*.json" | xargs -n 1 js-beautify --type=js -r
beautify-css:
	find $(SRC) -name "*.less" -or -name "*.css" | xargs -n 1 js-beautify --type=css -r
beautify-html:
	find $(SRC) -path $(SRC)/templates -prune -a -type f -o -name "*.html" | xargs -n 1 js-beautify --type=html -r
style-check: style-check-js
style-check-js:
	jscs $(SRC)
dist: minify # appcache
appcache:
	sed -i "s|\(# last updated: \).*|\1$(shell date --rfc-3339=seconds --utc)|" $(DIST)/syteup.appcache
minify: minify-pre minify-js minify-js-libs minify-css minify-html
minify-pre:
	#rm -rf $(DIST)/templates $(DIST)/imgs
	mkdir -p $(DIST) $(DIST)/templates $(DIST)/imgs
	cp -r $(SRC)/imgs/* $(DIST)/imgs
	cp $(SRC)/index.html $(DIST)
	cp -r $(SRC)/templates/* $(DIST)/templates
	cp $(CONF) $(DIST)/config.json 2>/dev/null || true
	#cp $(SRC)/syteup.appcache $(DIST)
	sed -i 's|.*<script .*||' $(DIST)/index.html
	sed -i 's|.*stylesheet/less.*||' $(DIST)/index.html
	sed -i 's|<!--syteup.min.css-->|<link rel="stylesheet" href="syteup.min.css" type="text/css" media="screen, projection">|' $(DIST)/index.html
	sed -i 's|<!--syteup.libs.js-->|<script defer src="syteup.libs.js" type="text/javascript"></script>|' $(DIST)/index.html
	sed -i 's|<!--syteup.min.js-->|<script defer src="syteup.min.js" type="text/javascript"></script>|' $(DIST)/index.html
minify-js:
	rm $(DIST)/syteup.js
	cat $(SRC)/js/*.js >> $(DIST)/syteup.js
	cat $(CONF) | json "plugins" | json -Mac "this.value===true" key | sed 's,_,-,g;s,\(.*\),$(SRC)/plugins/\1.js,' | xargs cat >> $(DIST)/syteup.js
	cat $(CONF) | json "blogs_settings.plugins" | json -Mac "this.value===true" key | sed 's,_,-,g;s,\(.*\),$(SRC)/plugins/\1.js,' | xargs cat >> $(DIST)/syteup.js
	cat $(CONF) | json "services" | json -Mac "this.value===true" key | sed 's,_,-,g;s,\(.*\),$(SRC)/services/\1.js,' | xargs cat >> $(DIST)/syteup.js
	cat $(CONF)| json "blog_platform" | sed 's,_,-,g;s,\(.*\),$(SRC)/blogs/\1.js,' | xargs cat >> $(DIST)/syteup.js
	json -f $(CONF) -c 'typeof(this.fields.contact)==="object"' >/dev/null && cat $(SRC)/services/syteup-contact.js >> $(DIST)/syteup.js
	uglifyjs -c --screw-ie8 $(DIST)/syteup.js -o $(DIST)/syteup.min.js
minify-js-libs:
	grep -o "js/libs/.*.js" $(SRC)/index.html | sed 's,^,$(SRC)/,' | xargs cat | uglifyjs -c --screw-ie3 -o $(DIST)/syteup.libs.js
	#grep -o "js/libs/.*.js" $(SRC)/index.html | sed 's,^,$(SRC)/,' | xargs cat >> $(DIST)/syteup.libs.js
minify-css:
	lessc $(LESSCFLAGS)  $(SRC)/less/styles.less $(DIST)/syteup.min.css
minify-html:
	html-minifier $(HTMLMINIFIERFLAGS) $(DIST)/index.html -o $(DIST)/index.html
