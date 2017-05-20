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
	CREDITS.md \
	functions.php \
	index.php \
	LICENSE.md \
	README.md \
	screenshot.png \
	style.css \
