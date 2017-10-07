/**
 * External dependencies
 */
import { uniqueId } from 'lodash';

/**
 * Internal dependencies
 */
import {
	NOTICE_DISPLAY,
	NOTICE_HIDE,
} from 'state/action-types';

/**
 * Returns an action object used in signalling that a new notice should be
 * displayed.
 *
 * @param  {String} status Status type of notice
 * @param  {String} text   Text of notice
 * @return {Object}        Action object
 */
export function displayNotice( status, text ) {
	return {
		type: NOTICE_DISPLAY,
		id: uniqueId(),
		status,
		text,
	};
}

/**
 * Returns an action object used in signalling that a new error notice should
 * be displayed.
 *
 * @param  {String} text Text of notice
 * @return {Object}      Action object
 */
export function displayErrorNotice( text ) {
	return displayNotice( 'error', text );
}

/**
 * Returns an action object used in signalling that an existing notice should
 * be dismissed.
 *
 * @param  {String} id Notice ID
 * @return {Object}    Action object
 */
export function hideNotice( id ) {
	return {
		type: NOTICE_HIDE,
		id,
	};
}
