/**
 * External dependencies
 */
import { h } from 'preact';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import Link from 'components/link';
import { USER_ID, BRAND_COLOR, LOGO, LOGIN_URL, LOGOUT_URL } from 'constant';
import { translate } from 'lib/i18n';

export default function Header() {
	const style = { backgroundColor: BRAND_COLOR };

	let logo;
	if ( LOGO ) {
		logo = <img src={ LOGO } />;
	} else {
		logo = (
			<h1 className="header__logo-fallback">
				Dones
			</h1>
		);
	}

	const isLoggedIn = USER_ID > 0;

	return (
		<header className="header" style={ style }>
			<Link to="/" class="header__logo-link">
				{ logo }
			</Link>
			<div className="header__actions">
				{ isLoggedIn && (
					<Button translucent to={ LOGOUT_URL }>
						{ translate( 'Log Out' ) }
					</Button>
				) }
				{ ! isLoggedIn && (
					<Button translucent to={ LOGIN_URL }>
						{ translate( 'Log In' ) }
					</Button>
				) }
			</div>
		</header>
	);
}
