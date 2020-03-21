/**
 * External dependencies
 */
import memoize from 'memize';

/**
 * Internal dependencies
 */
import HomeRoute from './home';
import DateRoute from './date';
import TagsRoute from './tags';
import TagRoute from './tag';
import NotFoundRoute from './not-found';

/** @typedef {import('preact').AnyComponent} PreactAnyComponent */

/**
 * Route matching tuple pair.
 *
 * @typedef {[RegExp,PreactAnyComponent]} RouteMatcher
 */

/**
 * Route descriptor object.
 *
 * @typedef RouteDescriptor
 *
 * @property {Record<string,string>} params Matched named parameter groups.
 * @property {PreactAnyComponent}    Route  Route component.
 */

/**
 * Router matchers.
 *
 * @type {RouteMatcher[]}
 */
const ROUTES = [
	[ /^$/, HomeRoute ],
	[ /^\/date\/(?<date>.*?)$/, DateRoute ],
	[ /^\/tags\/(?<tag>.*?)(\/page\/(?<page>.*?))?$/, TagRoute ],
	[ /^\/tags$/, TagsRoute ],
	[ /.*/, NotFoundRoute ],
];

/**
 * Given a string path, returns a route descriptor for that path, or undefined
 * if a route could not be matched.
 *
 * @param {string} path Path to match.
 *
 * @return {RouteDescriptor=} Route descriptor object.
 */
export const getRouteByPath = memoize( ( path ) => {
	// Strip query parameters, hash, trailing slash
	path = path.replace( /\/?[\?|#].*$/g, '' ).replace( /\/$/, '' );

	for ( let i = 0; i < ROUTES.length; i++ ) {
		const [ pattern, Route ] = ROUTES[ i ];
		const match = path.match( pattern );
		if ( match ) {
			return {
				params: match.groups,
				Route,
			};
		}
	}
} );
