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
import TagsRoute from './tags';
import TagRoute from './tag';
import NotFoundRoute from './not-found';

export default map( [
	[ '/', HomeRoute ],
	[ '/date/:date/', DateRoute ],
	[ '/tags/:tag/', TagRoute ],
	[ '/tags/', TagsRoute ],
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
