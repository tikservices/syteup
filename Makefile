pre-commit: test beautify
test: fix-js lint
fix-js:
	fixmyjs -l src/ || return 1
lint:
	jshint src/
beautify: beautify-js beautify-html beautifu-css

beautify-js:
	find src/ -name "*.js" -or -name "*.json" | xargs -n 1 js-beautify --type=js -r
beautify-css:
	find src/ -name "*.less" -or -name "*.css" | xargs -n 1 js-beautify --type=css -r
beautify-html:
	find src/ -name "*.html" | xargs -n 1 js-beautify --type=html -r
