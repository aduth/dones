/**
 * Internal dependencies
 */
import Request from 'lib/request';
import {
	TAGS_REQUEST,
	TAGS_REQUEST_FAILURE,
	TAGS_REQUEST_SUCCESS
} from 'state/action-types';
import { receiveTags } from './actions';

export default {
	[ TAGS_REQUEST ]: async ( { dispatch } ) => {
		try {
			const tags = await Request.get( '/dones/v1/tags' );
			dispatch( receiveTags( tags ) );
			dispatch( { type: TAGS_REQUEST_SUCCESS } );
		} catch ( error ) {
			dispatch( { type: TAGS_REQUEST_FAILURE } );
		}
	}
};
