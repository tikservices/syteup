pre-commit: beautify fix test
test: lint style-check
fix: fix-js
fix-js:
	find src/ \( -path src/static/less -o -path src/static/js/libs \) -prune -a -type f -o -name "*.js" -or -name "*.json" | xargs -n 1 fixmyjs -l
lint:
	jshint src/
beautify: beautify-js beautify-html
beautify-js:
	find src/ \( -path src/static/js/libs -o -path src/static/less \) -prune -a -type f -o -name "*.js" -or -name "*.json" | xargs -n 1 js-beautify --type=js -r
beautify-css:
	find src/ -name "*.less" -or -name "*.css" | xargs -n 1 js-beautify --type=css -r
beautify-html:
	find src/ \( -path src/templates -o -path src/static/templates \) -prune -a -type f -o -name "*.html" | xargs -n 1 js-beautify --type=html -r
style-check: style-check-js
style-check-js:
	jscs src/
