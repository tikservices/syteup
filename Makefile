demo:
	rm -rf demo
	git checkout --merge master dist
	git checkout --merge master README.md
	mv dist demo
