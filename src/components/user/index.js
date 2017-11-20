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

function User( { name, avatars } ) {
	return (
		<span className="user">
			<img
				src={ avatars[ 30 ] }
				alt={ translate( 'User avatar' ) }
				srcset={ `${ avatars[ 30 ] } 1x, ${ avatars[ 60 ] } 2x` }
				height="30"
				width="30"
				className="user__avatar-image" />
			{ name }
		</span>
	);
}

export default connect( ( state, { userId } ) => ( {
	...getUser( state, userId ),
} ) )( User );
