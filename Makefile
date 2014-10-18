LESSCFLAGS=-O2 --no-ie-compat --no-js --strict-imports --strict-math=on -rp=src/ -x --clean-css
HTMLMINIFIERFLAGS=--remove-comments --collapse-whitespace --minify-js

pre-commit: beautify fix test minify
test: lint # style-check
fix: fix-js
fix-js:
	find src/ \( -path src/less -o -path src/js/libs \) -prune -a -type f -o -name "*.js" -or -name "*.json" | xargs -n 1 fixmyjs -c .jshintrc || true
lint: lint-js lint-json
lint-json:
	ls .jsbeautifyrc .jshintrc .jscsrc package.json | xargs -n 1 jsonlint -ip
	find src/ -name "*.json" | xargs -n 1 jsonlint -ip
lint-js:
	jshint src/
beautify: beautify-html # beautify-js
beautify-js:
	find src/ \( -path src/js/libs -o -path src/less \) -prune -a -type f -o -name "*.js" -or -name "*.json" | xargs -n 1 js-beautify --type=js -r
beautify-css:
	find src/ -name "*.less" -or -name "*.css" | xargs -n 1 js-beautify --type=css -r
beautify-html:
	find src/ -path src/templates -prune -a -type f -o -name "*.html" | xargs -n 1 js-beautify --type=html -r
style-check: style-check-js
style-check-js:
	jscs src/
minify: minify-pre minify-js minify-js-libs minify-css minify-html
minify-pre:
	rm -rf dist/
	mkdir dist
	cp -r src/imgs dist/
	cp src/index.html dist/
	cp -r src/templates dist/
	cp src/config.json dist
	mkdir -p dist/js/libs
	cp src/js/libs/text.js dist/js/libs/
	sed -i 's|.*<script .*||' dist/index.html
	sed -i 's|.*stylesheet/less.*||' dist/index.html
	sed -i 's|<!--syteup.min.css-->|<link rel="stylesheet" href="syteup.min.css" type="text/css" media="screen, projection">|' dist/index.html
	sed -i 's|<!--syteup.libs.js-->|<script defer src="syteup.libs.js" type="text/javascript"></script>|' dist/index.html
	sed -i 's|<!--syteup.min.js-->|<script defer src="syteup.min.js" type="text/javascript"></script>|' dist/index.html
minify-js:
	cat src/js/*.js >> dist/syteup.js
	cat src/config.json| json "plugins" | json -Mac "this.value===true" key | sed 's,_,-,g;s,\(.*\),src/plugins/\1.js,' | xargs cat >> dist/syteup.js
	cat src/config.json| json "blogs_settings.plugins" | json -Mac "this.value===true" key | sed 's,_,-,g;s,\(.*\),src/plugins/\1.js,' | xargs cat >> dist/syteup.js
	cat src/config.json| json "services" | json -Mac "this.value===true" key | sed 's,_,-,g;s,\(.*\),src/services/\1.js,' | xargs cat >> dist/syteup.js
	cat src/config.json| json "blog_platform" | sed 's,_,-,g;s,\(.*\),src/blogs/\1.js,' | xargs cat >> dist/syteup.js
	uglifyjs -c --screw-ie8 dist/syteup.js -o dist/syteup.min.js
minify-js-libs:
	grep -o "js/libs/.*.js" src/index.html | sed 's,^,src/,' | xargs cat >> dist/syteup.libs.js
#	grep -o "js/libs/.*.js" src/index.html | sed 's,^,src/,' | xargs cat | uglifyjs -c --screw-ie3 -o dist/syteup.libs.js
minify-css:
	lessc $(LESSCFLAGS)  src/less/styles.less dist/syteup.min.css
minify-html:
	html-minifier $(HTMLMINIFIERFLAGS) dist/index.html -o dist/index.html
