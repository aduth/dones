/**
 * Internal dependencies
 */
import { DOCUMENT_HEAD_TITLE_SET } from 'state/action-types';

export function setDocumentHeadTitle( title ) {
	return {
		type: DOCUMENT_HEAD_TITLE_SET,
		title,
	};
}
