#!/bin/sh

set -e
cd "$(dirname "$0")"
cd ..
npm install
npm run build
rm -f dones.zip
zip -r dones.zip \
	dist \
	img \
	inc \
	languages \
	CHANGELOG.md \
	CREDITS.md \
	functions.php \
	index.php \
	LICENSE.md \
	manifest.json \
	README.md \
	screenshot.png \
	style.css \
	-x "*.DS_Store" \
	-x "languages/dones.pot" \
	-x "languages/*.po"
