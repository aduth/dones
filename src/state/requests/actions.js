/**
 * Internal dependencies
 */
import {
	REQUEST_NONCE_SET,
	REQUEST_PRELOAD_SET,
	REQUEST_PRELOAD_CLEAR
} from 'state/action-types';

/**
 * Returns an action object used in signalling that a fresh request nonce has
 * been received.
 *
 * @param  {string} nonce Request nonce
 * @return {Object}       Action object
 */
export function setRequestNonce( nonce ) {
	return {
		type: REQUEST_NONCE_SET,
		nonce
	};
}

/**
 * Returns an action object used in signalling that preloaded responses have
 * been made available.
 *
 * @param  {Object} responses Preloaded responses, keyed by path with value of
 *                            keys data and headers
 * @return {Object}           Action object
 */
export function setPreloadedResponses( responses ) {
	return {
		type: REQUEST_PRELOAD_SET,
		responses
	};
}

export function clearPreloadedResponses() {
	return {
		type: REQUEST_PRELOAD_CLEAR
	};
}
