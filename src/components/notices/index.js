/**
 * External dependencies
 */
import { createElement } from 'preact';
import { isEmpty, map } from 'lodash';
import { useSelector } from 'prsh';

/**
 * Internal dependencies
 */
import { getNotices } from 'state/selectors';

function Notices() {
	const notices = useSelector( getNotices );
	if ( isEmpty( notices ) ) {
		return null;
	}

	return (
		<ul className="notices">
			{ map( notices, ( { id, status, text } ) => (
				<li key={ id } className={ 'notices__notice is-' + status }>
					{ text }
				</li>
			) ) }
		</ul>
	);
}

export default Notices;
