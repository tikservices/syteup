pre-commit: beautify fix test
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
beautify: beautify-js beautify-html
beautify-js:
	find src/ \( -path src/js/libs -o -path src/less \) -prune -a -type f -o -name "*.js" -or -name "*.json" | xargs -n 1 js-beautify --type=js -r
beautify-css:
	find src/ -name "*.less" -or -name "*.css" | xargs -n 1 js-beautify --type=css -r
beautify-html:
	find src/ -path src/templates -prune -a -type f -o -name "*.html" | xargs -n 1 js-beautify --type=html -r
style-check: style-check-js
style-check-js:
	jscs src/
