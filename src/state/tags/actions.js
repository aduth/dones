/**
 * Internal dependencies
 */
import { REQUEST, TAGS_RECEIVE } from 'state/action-types';

export function receiveTags( tags ) {
	return {
		type: TAGS_RECEIVE,
		tags
	};
}

export function requestTags() {
	return {
		type: REQUEST,
		path: '/dones/v1/tags',
		success: receiveTags
	};
}
