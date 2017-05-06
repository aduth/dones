/**
 * External dependencies
 */
import { createElement } from 'preact';
import { connect } from 'preact-redux';

/**
 * Internal dependencies
 */
import { translate } from 'lib/i18n';
import { getUser } from 'state/selectors';

function User( { name, avatar } ) {
	return (
		<span className="user">
			{ avatar && (
				<img
					src={ avatar }
					alt={ translate( 'User avatar' ) }
					height="30"
					width="30"
					className="user__avatar-image" />
			) }
			{ name }
		</span>
	);
}

export default connect( ( state, { userId } ) => (
	getUser( state, userId )
) )( User );
