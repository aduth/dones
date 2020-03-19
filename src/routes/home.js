/**
 * External dependencies
 */
import { useEffect } from 'preact/hooks';
import { useStore } from 'prsh';
import { date as phpdate } from 'phpdate';

/**
 * Internal dependencies
 */
import { replaceRoute } from 'state/routing/actions';
import { toSiteTime } from 'lib/i18n';

function HomeRoute() {
	const { dispatch } = useStore();

	useEffect( () => {
		const date = phpdate( 'Y-m-d', toSiteTime() );
		dispatch( replaceRoute( `/date/${ date }/` ) );
	}, [] );

	return null;
}

export default HomeRoute;
