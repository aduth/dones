/**
 * Internal dependencies
 */
import { NOTICE_DISPLAY } from 'state/action-types';
import { hideNotice } from './actions';

export default {
	[ NOTICE_DISPLAY ]( action, store ) {
		const { id } = action;
		const { dispatch } = store;

		// Automatically hide notice after timeout
		setTimeout( () => dispatch( hideNotice( id ) ), 5000 );
	}
};
