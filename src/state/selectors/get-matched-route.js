/**
 * External dependencies
 */
import { parse } from 'querystringify';

/**
 * Internal dependencies
 */
import routes from 'routes';
import { getRoutePath } from './';

export default function getMatchedRoute( state ) {
	const path = getRoutePath( state );
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
			query: parse( search )
		};
	}

	return {};
}
