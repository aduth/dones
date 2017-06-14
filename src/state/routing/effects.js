/**
 * Internal dependencies
 */
import { ROUTE_PUSH, ROUTE_REPLACE } from 'state/action-types';
import { getRouteByPath } from 'routes';

function prepareRoute( action ) {
	const { path } = action;

	// Get matched route
	const route = getRouteByPath( path );

	// Test whether a component exists for this route with preparation needs
	const { Route } = route;
	if ( Route && Route.prepareRoute ) {
		// Route prepare will return an array of actions to dispatch. Pass to
		// refx, which combined with redux-multi will dispatch each.
		return Route.prepareRoute( route );
	}
}

export default {
	[ ROUTE_PUSH ]: prepareRoute,
	[ ROUTE_REPLACE ]: prepareRoute
};
