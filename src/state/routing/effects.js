/**
 * Internal dependencies
 */
import {
	ROUTE_PRELOAD,
	ROUTE_PUSH,
	ROUTE_REPLACE,
} from 'state/action-types';
import {
	startPreloadCapture,
	stopPreloadCapture,
} from 'state/requests/actions';
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
	[ ROUTE_PRELOAD ]( action ) {
		// Routes can optionally provide an array of actions to be invoked when
		// visited to prepare data needs. If preparations exist, dispatch while
		// flagging as captured for preload.
		const preparations = prepareRoute( action );
		if ( preparations ) {
			return [
				startPreloadCapture(),
				...preparations,
				stopPreloadCapture(),
			];
		}
	},
	[ ROUTE_PUSH ]: prepareRoute,
	[ ROUTE_REPLACE ]: prepareRoute,
};
