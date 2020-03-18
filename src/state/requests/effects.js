/**
 * Internal dependencies
 */
import {
	clearPreloadedResponse,
	clearPreloadedResponses,
} from './actions';
import {
	REQUEST_PRELOAD_ADD,
	REQUEST_PRELOAD_SET,
} from 'state/action-types';

/**
 * Time-to-live duration in milliseconds for preloaded responses.
 *
 * @type {number}
 */
const PRELOAD_RESET_TIMEOUT = 3000;

export default {
	[ REQUEST_PRELOAD_ADD ]( action, store ) {
		const { path, id } = action;
		const { dispatch } = store;

		setTimeout(
			() => dispatch( clearPreloadedResponse( path, id ) ),
			PRELOAD_RESET_TIMEOUT
		);
	},
	[ REQUEST_PRELOAD_SET ]( action, store ) {
		const { id } = action;
		const { dispatch } = store;

		setTimeout(
			() => dispatch( clearPreloadedResponses( id ) ),
			PRELOAD_RESET_TIMEOUT
		);
	},
};
