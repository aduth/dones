/**
 * Internal dependencies
 */
import { ROUTE_PRELOAD, ROUTE_PUSH, ROUTE_REPLACE } from 'state/action-types';

export function pushRoute( path ) {
	return {
		type: ROUTE_PUSH,
		path,
	};
}

export function replaceRoute( path ) {
	return {
		type: ROUTE_REPLACE,
		path,
	};
}

/**
 * Returns an action object used in signalling that data requirements for a
 * given path should be fetched as preload.
 *
 * @param  {string} path Route path to preload
 * @return {Object}      Action object
 */
export function preloadRoute( path ) {
	return {
		type: ROUTE_PRELOAD,
		path,
	};
}
