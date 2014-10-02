pre-commit: test beautify
test: fix-js lint
fix-js:
	find src/ -path src/static/js/libs -prune -a -type f -o -name "*.js" -or -name "*.json" | xargs -n 1 fixmyjs -l
lint:
	jshint src/
beautify: beautify-js
beautify-js:
	find src/ -path src/static/js/libs -prune -a -type f -o -name "*.js" -or -name "*.json" | xargs -n 1 js-beautify --type=js -r
beautify-css:
	find src/ -name "*.less" -or -name "*.css" | xargs -n 1 js-beautify --type=css -r
beautify-html:
	find src/ -name "index.html" | xargs -n 1 js-beautify --type=html -r
