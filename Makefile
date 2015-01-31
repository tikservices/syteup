SRC=src
DIST=dist
CONF=$(SRC)/config.json
ALL_BLOG_PLATFORMS=false # just to force support of all availbale blog platforms
LESSCFLAGS=--no-ie-compat --no-js --strict-imports --strict-math=on -rp=$(SRC)/ -x --clean-css
HTMLMINIFIERFLAGS=--remove-comments --collapse-whitespace --minify-js

.NOTPARALLEL : pre-commit minify
pre-commit: beautify fix test dist
test: lint # style-check
fix: fix-js
fix-js:
	find $(SRC) -path $(SRC)/js/libs -prune -a -type f -o -name "*.js" -or -name "*.json" | xargs -n 1 fixmyjs -c .jshintrc || true
lint: lint-js lint-json
lint-json:
	ls .jsbeautifyrc .jshintrc package.json | xargs -n 1 jsonlint -ip
	for json in `find $(SRC) -name "*.json"`; do jsonlint -ip $${json};done
	jsonlint -ip $(CONF)
lint-js:
	jshint $(SRC) --exclude $(SRC)/js/libs
beautify: beautify-html
beautify-js:
	find $(SRC) -path $(SRC)/js/libs -prune -a -type f -o -name "*.js" -or -name "*.json" | xargs -n 1 js-beautify --type=js -r
beautify-css:
	find $(SRC) -name "*.less" -or -name "*.css" | xargs -n 1 js-beautify --type=css -r
beautify-html:
	find $(SRC) -path $(SRC)/templates -prune -a -type f -o -name "*.html" | xargs -n 1 js-beautify --type=html -r
dist: minify # appcache
appcache:
	sed -i "s|\(# last updated: \).*|\1$(shell date --rfc-3339=seconds --utc)|" $(DIST)/syteup.appcache
minify: minify-pre minify-js minify-css minify-html
minify-js: minify-js-core minify-js-modules minify-js-libs
minify-pre:
	#rm -rf $(DIST)/templates $(DIST)/imgs
	mkdir -p $(DIST) $(DIST)/templates $(DIST)/imgs $(DIST)/plugins $(DIST)/services $(DIST)/blogs
	cp -r $(SRC)/imgs/* $(DIST)/imgs
	cp $(SRC)/index.html $(DIST)
	cp -r $(SRC)/templates/* $(DIST)/templates
	cp -r $(SRC)/services/* $(DIST)/services
	cp -r $(SRC)/plugins/* $(DIST)/plugins
	cp -r $(SRC)/blogs/* $(DIST)/blogs
	cp $(CONF) $(DIST)/config.json 2>/dev/null || true
	#cp $(SRC)/syteup.appcache $(DIST)
	sed -i 's,.*<script \(async\|defer\).*,,' $(DIST)/index.html
	sed -i 's|.*stylesheet/less.*||' $(DIST)/index.html
	sed -i 's|<!--syteup.min.css-->|<link rel="stylesheet" href="syteup.min.css" type="text/css"  charset="UTF-8" media="screen, projection">|' $(DIST)/index.html
	sed -i 's|<!--syteup-profiles.min.css-->|<link rel="stylesheet" href="syteup-profiles.min.css" id="profiles-style" type="text/css"  charset="UTF-8" media="only x">|' $(DIST)/index.html
	sed -i 's|<!--syteup.libs.js-->|<script defer src="syteup.libs.js" type="text/javascript" charset="UTF-8"></script>|' $(DIST)/index.html
	sed -i 's|<!--syteup.min.js-->|<script defer src="syteup.min.js" type="text/javascript" charset="UTF-8"></script>|' $(DIST)/index.html
	sed -i 's|<!--syteup-modules.min.js-->|<script defer src="syteup-modules.min.js" type="text/javascript" charset="UTF-8"></script>|' $(DIST)/index.html
minify-js-core:
	rm $(DIST)/syteup.js || true
	cat $(SRC)/js/*.js >> $(DIST)/syteup.js
	( $(ALL_BLOG_PLATFORMS) && cat $(SRC)/blogs/*.js \
		|| ( cat $(CONF)| json "blog_platform" | sed 's,_,-,g;s,\(.*\),$(SRC)/blogs/\1.js,' | xargs cat )) >> $(DIST)/syteup.js
	uglifyjs -c --screw-ie8 $(DIST)/syteup.js -o $(DIST)/syteup.min.js
minify-js-modules:
	rm $(DIST)/syteup-modules.js || true
	cat $(CONF) | json "plugins" | json -Mac "this.value===true" key | sed 's,_,-,g;s,\(.*\),$(SRC)/plugins/\1.js,' | xargs cat >> $(DIST)/syteup-modules.js
	cat $(CONF) | json "blogs_settings.plugins" | json -Mac "this.value===true" key | sed 's,_,-,g;s,\(.*\),$(SRC)/plugins/\1.js,' | xargs cat >> $(DIST)/syteup-modules.js
	cat $(CONF) | json "services" | json -Mac "this.value===true" key | sed 's,_,-,g;s,\(.*\),$(SRC)/services/\1.js,' | xargs cat >> $(DIST)/syteup-modules.js
	json -f $(CONF) -c 'typeof(this.fields.contact)==="object"' >/dev/null && cat $(SRC)/services/contact.js >> $(DIST)/syteup-modules.js
	uglifyjs -c --screw-ie8 $(DIST)/syteup-modules.js -o $(DIST)/syteup-modules.min.js
minify-js-libs:
	grep -o "../bower_components/.*.js" $(SRC)/index.html | sed 's,^,$(SRC)/,;s,.*less/.*,,' | xargs cat | uglifyjs -c --screw-ie3 -o $(DIST)/syteup.libs.js
	#grep -o "js/libs/.*.js" $(SRC)/index.html | sed 's,^,$(SRC)/,' | xargs cat >> $(DIST)/syteup.libs.js
minify-css:
	lessc $(LESSCFLAGS)  $(SRC)/less/styles.less $(DIST)/syteup.min.css
	lessc $(LESSCFLAGS)  $(SRC)/less/profiles.less $(DIST)/syteup-profiles.min.css
minify-html:
	html-minifier $(HTMLMINIFIERFLAGS) $(DIST)/index.html -o $(DIST)/index.html

rss:
	node tools/rss-generator.js $(SRC) $(CONF) $(DIST)
