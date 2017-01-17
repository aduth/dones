/**
 * Internal dependencies
 */
import { ROUTE_PUSH, ROUTE_REPLACE } from 'state/action-types';

export function pushRoute( path ) {
	return {
		type: ROUTE_PUSH,
		path
	};
}

export function replaceRoute( path ) {
	return {
		type: ROUTE_REPLACE,
		path
	};
}
