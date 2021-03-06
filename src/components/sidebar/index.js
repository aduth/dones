/**
 * External dependencies
 */
import { startsWith } from 'lodash';
import { date as phpdate } from 'phpdate';
import { useSelector } from 'prsh';

/**
 * Internal dependencies
 */
import Link from 'components/link';
import {
	USER_ID,
	BRAND_COLOR,
	LOGO,
	LOGIN_URL,
	LOGOUT_URL,
	SITE_NAME,
} from 'constant';
import { translate, toSiteTime } from 'lib/i18n';
import { getRoutePath } from 'state/selectors';
import SidebarAction from './action';

function Sidebar() {
	const path = useSelector( getRoutePath );
	const isLoggedIn = USER_ID > 0;
	const date = phpdate( 'Y-m-d', toSiteTime() );

	return (
		<header className="sidebar">
			<Link
				to={ `/date/${ date }/` }
				preload
				style={ { backgroundColor: BRAND_COLOR } }
				className="sidebar__logo-link"
			>
				<h1 className="sidebar__logo">
					<span className="sidebar__site-name">{ SITE_NAME }</span>
					{ LOGO && (
						<img
							src={ LOGO }
							alt="logo"
							className="sidebar__logo-image"
						/>
					) }
				</h1>
			</Link>
			<div className="sidebar__action-sets">
				<nav className="sidebar__actions">
					<SidebarAction
						icon="th-list"
						to={ `/date/${ date }/` }
						selected={ startsWith( path, '/date/' ) }
					>
						{ translate( 'Dones' ) }
					</SidebarAction>
					<SidebarAction
						icon="hashtag"
						to="/tags/"
						selected={ startsWith( path, '/tags/' ) }
					>
						{ translate( 'Tags' ) }
					</SidebarAction>
				</nav>
				<nav className="sidebar__actions is-end">
					{ isLoggedIn && (
						<SidebarAction icon="sign-out" to={ LOGOUT_URL }>
							{ translate( 'Log Out' ) }
						</SidebarAction>
					) }
					{ ! isLoggedIn && (
						<SidebarAction icon="sign-in" to={ LOGIN_URL }>
							{ translate( 'Log In' ) }
						</SidebarAction>
					) }
				</nav>
			</div>
		</header>
	);
}

export default Sidebar;
