/**
 * External dependencies
 */
import { useEffect } from 'preact/hooks';
import { useSelector } from 'prsh';

/**
 * Internal dependencies
 */
import { getFormattedTitle } from 'state/selectors';

function DocumentHead() {
	const title = useSelector( getFormattedTitle );

	useEffect( () => {
		if ( typeof document !== 'undefined' && document.title !== title ) {
			document.title = title;
		}
	}, [ title ] );

	return null;
}

export default DocumentHead;
