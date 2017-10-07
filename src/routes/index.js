/**
 * External dependencies
 */
import pathToRegexp from 'path-to-regexp';
import { map } from 'lodash';
import { parse } from 'querystringify';
import memoize from 'memize';

/**
 * Internal dependencies
 */
import HomeRoute from './home';
import DateRoute from './date';
import TagsRoute from './tags';
import TagRoute from './tag';
import NotFoundRoute from './not-found';

export const routes = map( [
	[ '/', HomeRoute ],
	[ '/date/:date/', DateRoute ],
	[ '/tags/:tag/page/:page', TagRoute ],
	[ '/tags/:tag', TagRoute ],
	[ '/tags/', TagsRoute ],
	[ '*', NotFoundRoute ],
], ( [ path, Route ] ) => {
	const keys = [];

	return {
		path,
		keys,
		Route,
		regexp: pathToRegexp( path, keys ),
	};
} );

export const getRouteByPath = memoize( ( path ) => {
	const [ pathname, search = '' ] = path.split( '?' );

	for ( let r = 0, rl = routes.length; r < rl; r++ ) {
		const { regexp, keys, Route } = routes[ r ];
		const match = pathname.match( regexp );
		if ( ! match ) {
			continue;
		}

		const params = {};
		for ( let m = 1, ml = match.length; m < ml; m++ ) {
			params[ keys[ m - 1 ].name ] = decodeURIComponent( match[ m ] );
		}

		return {
			params,
			Route,
			query: parse( search ),
		};
	}

	return {};
} );
