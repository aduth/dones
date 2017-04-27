/**
 * Internal dependencies
 */
import { REQUEST_PRELOAD_CLEAR } from 'state/action-types';

export function clearPreloadedResponses() {
	return {
		type: REQUEST_PRELOAD_CLEAR
	};
}
