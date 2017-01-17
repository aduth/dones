/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Internal dependencies
 */
import { getMatchedRoute } from './';

export default function getRouteParam( state, param ) {
	return get( getMatchedRoute( state ), [ 'params', param ], null );
}
