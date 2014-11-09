demo:
	rm -rf demo
	git checkout --merge master dist
	mv dist demo
