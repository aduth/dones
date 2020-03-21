/**
 * External dependencies
 */
import { useSelector } from 'prsh';

/**
 * Internal dependencies
 */
import { translate } from 'lib/i18n';
import { getUser } from 'state/selectors';

function User( { userId } ) {
	const { name, avatars } = useSelector( ( state ) =>
		getUser( state, userId )
	);

	return (
		<span className="user">
			<img
				src={ avatars[ 30 ] }
				alt={ translate( 'User avatar' ) }
				srcSet={ avatars[ 60 ] + ' 2x' }
				height="30"
				width="30"
				className="user__avatar-image"
			/>
			{ name }
		</span>
	);
}

export default User;
