/**
 * Internal dependencies
 */
import { SITE_NAME } from 'constant';
import { getTitle } from './';

export default function getFormattedTitle( state ) {
	const title = getTitle( state );
	if ( title ) {
		return `${ SITE_NAME } | ${ title }`;
	}

	return SITE_NAME;
}
