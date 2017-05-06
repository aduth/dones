/**
 * Internal dependencies
 */
import { REQUEST, TAGS_REQUEST } from 'state/action-types';
import { receiveTags } from 'state/tags/actions';

export default {
	[ TAGS_REQUEST ]() {
		return {
			type: REQUEST,
			path: '/dones/v1/tags',
			success: receiveTags
		};
	}
};
