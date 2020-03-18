/**
 * External dependencies
 */
import { includes, get } from 'lodash';

/**
 * Internal dependencies
 */
import { SITE_URL } from 'constant';
import { ROUTE_PUSH, ROUTE_REPLACE } from 'state/action-types';
import { replaceRoute } from './actions';

/**
 * Action types which affect route location.
 *
 * @type {Array}
 */
const ROUTE_CHANGE_TYPES = [ ROUTE_PUSH, ROUTE_REPLACE ];

/**
 * Redux middleware used in synchronizing Redux routing state with History API.
 *
 * @param {import('redux').Store} store
 *
 * @return {Function} Redux middleware
 */
export default ( { dispatch } ) => {
	window.addEventListener( 'popstate', function( event ) {
		if ( event.state && event.state.path ) {
			dispatch( replaceRoute( event.state.path ) );
		}
	} );

	return ( next ) => ( action ) => {
		const { type, path } = action;
		if ( includes( ROUTE_CHANGE_TYPES, type ) ) {
			const historyFn =
				ROUTE_PUSH === type ? 'pushState' : 'replaceState';
			if (
				ROUTE_PUSH !== type ||
				path !== get( history.state, 'path' )
			) {
				history[ historyFn ]( { path }, null, SITE_URL + path );
			}

			window.scrollTo( 0, 0 );
		}

		return next( action );
	};
};
