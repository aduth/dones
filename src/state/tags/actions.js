/**
 * Internal dependencies
 */
import { TAGS_REQUEST, TAGS_RECEIVE } from 'state/action-types';

export function receiveTags( tags ) {
	return {
		type: TAGS_RECEIVE,
		tags,
	};
}

export function requestTags() {
	return {
		type: TAGS_REQUEST,
	};
}
