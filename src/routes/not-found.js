/**
 * Internal dependencies
 */
import Page from 'components/page';
import { translate } from 'lib/i18n';

export default function NotFoundRoute() {
	return <Page title={ translate( 'Page Not Found' ) }>Not Found</Page>;
}
