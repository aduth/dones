/**
 * External dependencies
 */
import { createElement } from 'preact';
import { connect } from 'preact-redux';
import { isEmpty, map } from 'lodash';

/**
 * Internal dependencies
 */
import { getNotices } from 'state/selectors';

function Notices( { notices } ) {
	if ( isEmpty( notices ) ) {
		return null;
	}

	return (
		<ul className="notices">
			{ map( notices, ( { id, status, text } ) => (
				<li
					key={ id }
					className={ 'notices__notice is-' + status }>
					{ text }
				</li>
			) ) }
		</ul>
	);
}

export default connect( ( state ) => ( {
	notices: getNotices( state ),
} ) )( Notices );
