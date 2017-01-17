/**
 * External dependencies
 */
import pathToRegexp from 'path-to-regexp';
import { map } from 'lodash';

/**
 * Internal dependencies
 */
import HomeRoute from './home';
import DateRoute from './date';
import NotFoundRoute from './not-found';

export default map( [
	[ '/', HomeRoute ],
	[ '/date/:date', DateRoute ],
	[ '*', NotFoundRoute ]
], ( [ path, Route ] ) => {
	const keys = [];

	return {
		path,
		keys,
		Route,
		regexp: pathToRegexp( path, keys ),
	};
} );
