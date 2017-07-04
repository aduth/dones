/**
 * External dependencies
 */
import { uniqueId } from 'lodash';

/**
 * Internal dependencies
 */
import {
	REQUEST_NONCE_SET,
	REQUEST_PATH_REQUEST_SET,
	REQUEST_PRELOAD_ADD,
	REQUEST_PRELOAD_SET,
	REQUEST_PRELOAD_CLEAR,
	REQUEST_PRELOAD_CAPTURE_START,
	REQUEST_PRELOAD_CAPTURE_STOP,
	REQUEST_PATH_IS_PRELOADING_SET
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
		id: uniqueId(),
		responses
	};
}

/**
 * Returns an action object used in signalling that a preloaded response has
 * been made available for the specified path.
 *
 * @param  {String} path     Path for which preloaded data is received
 * @param  {Object} response Response payload with data and headers
 * @return {Object}          Action object
 */
export function addPreloadedResponse( path, response ) {
	return {
		type: REQUEST_PRELOAD_ADD,
		id: uniqueId(),
		path,
		response
	};
}

/**
 * Returns an action object used in signalling that the preloaded responses
 * received with the given preload transaction ID should be removed.
 *
 * @param  {String} id Assigned preload transaction ID
 * @return {Object}    Action object
 */
export function clearPreloadedResponses( id ) {
	return {
		type: REQUEST_PRELOAD_CLEAR,
		id
	};
}

/**
 * Returns an action object used in signalling that the preloaded response
 * received with the given preload transaction ID and path should be removed.
 *
 * @param  {String} path Path for which preloaded response was received
 * @param  {String} id   Assigned preload transaction ID
 * @return {Object}      Action object
 */
export function clearPreloadedResponse( path, id ) {
	return {
		type: REQUEST_PRELOAD_CLEAR,
		path,
		id
	};
}

/**
 * Returns an action object used in signalling that all dispatched request
 * actions until the capture is subsequently stopped are to be considered as
 * as intended for preload only.
 *
 * @return {Object} Action object
 */
export function startPreloadCapture() {
	return {
		type: REQUEST_PRELOAD_CAPTURE_START
	};
}

/**
 * Returns an action object used in signalling that capturing dispatched
 * request actions as preload is to be stopped.
 *
 * @return {Object} Action object
 */
export function stopPreloadCapture() {
	return {
		type: REQUEST_PRELOAD_CAPTURE_STOP
	};
}

/**
 * Returns an action object used in signalling that the request object for the
 * specified path and parameters should be assigned.
 *
 * @param  {String}  path    Request path
 * @param  {Object}  params  Request parameters
 * @param  {Promise} request Request
 * @return {Object}          Action object
 */
export function setPathRequest( path, params, request ) {
	return {
		type: REQUEST_PATH_REQUEST_SET,
		path,
		params,
		request
	};
}

/**
 * Returns an action object used in signalling whether a request is in progress
 * to preload the specified path
 *
 * @param  {String}  path         Request path
 * @param  {Boolean} isPreloading Whether preloading
 * @return {Object}               Action object
 */
export function setPathIsPreloading( path, isPreloading ) {
	return {
		type: REQUEST_PATH_IS_PRELOADING_SET,
		path,
		isPreloading
	};
}
