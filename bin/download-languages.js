#!/usr/bin/env node

/* eslint-disable no-console, camelcase */

/**
 * External dependencies
 */

const request = require( 'request-promise' );
const path = require( 'path' );
const fs = require( 'fs' );

/**
 * POEditor project ID.
 *
 * @type {Number}
 */
const PROJECT_ID = 151513;

/**
 * Token for POEditor API, provided via environment variable.
 *
 * @type {String}
 */
const API_TOKEN = process.env.POEDITOR_API_TOKEN;

/**
 * POEditor root API URL.
 *
 * @type {String}
 */
const API_ROOT = 'https://api.poeditor.com/v2';

/**
 * Regular expression for matching content disposition filename.
 *
 * @type {RegExp}
 */
const RX_FILENAME = /(?:^|;\s*)filename="(.+?\.mo)"(?:;|$)/;

/**
 * Output folder for language files.
 *
 * @type {[type]}
 */
const OUTPUT_FOLDER = path.join( __dirname, '/../languages' );

/**
 * Given a response object, returns the filename from the content disposition
 * headers, or undefined if the filename cannot be determined.
 *
 * @param  {Object}  response Request response.
 * @return {?String}          Response filename.
 */
function getFilename( response ) {
	const disposition = response.headers[ 'content-disposition' ];
	if ( ! disposition ) {
		return;
	}

	const match = disposition.match( RX_FILENAME );
	if ( ! match ) {
		return;
	}

	return match[ 1 ];
}

/**
 * Utility for retrieving API response from POEditor.
 *
 * @param  {String}  route POEditor API route path.
 * @param  {Object}  body  Body to send as form data.
 * @return {Promise}       Promise resolved with API result.
 */
async function getApiResult( route, body ) {
	const { result } = await request.post( API_ROOT + route, {
		form: body,
		json: true,
	} );

	return result;
}

/**
 * Downloads and writes provided URL to languages output folder.
 *
 * @param  {String} link URL to download.
 * @return {Promise}     Promise resolved when file written.
 */
async function getExport( link ) {
	return new Promise( ( resolve, reject ) => {
		const stream = request
			.get( link )
			.on( 'response', function( response ) {
				const filename = getFilename( response );
				if ( ! filename ) {
					reject( new Error( 'Could not determine filename for link: ' + link ) );
					return;
				}

				const outputFile = path.join( OUTPUT_FOLDER, filename );
				stream.pipe( fs.createWriteStream( outputFile ) );
			} )
			.on( 'error', reject )
			.on( 'finish', resolve );
	} );
}

/**
 * Downloads and writes provided URLs to languages output folder.
 *
 * @param  {String[]} links URLs to download.
 * @return {Promise}        Promise resolved when files written.
 */
async function getExports( links ) {
	return await Promise.all( links.map( getExport ) );
}

/**
 * Retrieves and resolves with language codes for project.
 *
 * @return {Promise} Promise resolving with language codes.
 */
async function getLanguageCodes() {
	const result = await getApiResult( '/languages/list', {
		api_token: API_TOKEN,
		id: PROJECT_ID,
	} );

	return result.languages.map( ( language ) => language.code );
}

/**
 * Retrieves and resolves with export link for given language code.
 *
 * @param  {String}  code Language code to retrieve.
 * @return {Promise}      Promise resolving with export link.
 */
async function getExportLink( code ) {
	const result = await getApiResult( '/projects/export', {
		api_token: API_TOKEN,
		id: PROJECT_ID,
		language: code,
		type: 'mo',
	} );

	return result.url;
}

/**
 * Retrieves and resolves with export links for given language codes.
 *
 * @param  {String[]} codes Language codes to retrieve.
 * @return {Promise}        Promise resolving with export links.
 */
async function getExportLinks( codes ) {
	return await Promise.all( codes.map( getExportLink ) );
}

if ( ! API_TOKEN ) {
	throw new Error(
		'Must provide POEditor API token.\n' +
		'Generate an API token at: https://poeditor.com/account/api\n\n' +
		'Usage: POEDITOR_API_TOKEN=42a1f3d622cf5182942c856bd2d508c7 npm run download-languages\n'
	);
}

getLanguageCodes()
	.then( ( codes ) => getExportLinks( codes ) )
	.then( ( links ) => getExports( links ) )
	.catch( ( error ) => {
		console.error( 'An error occurred!\n\n' + error.message );

		process.exit( 1 );
	} );
