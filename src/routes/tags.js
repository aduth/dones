/**
 * External dependencies
 */
import { createElement } from 'preact';

/**
 * Internal dependencies
 */
import Page from 'components/page';
import TagsList from 'components/tags-list';
import { requestTags } from 'state/tags/actions';
import { translate } from 'lib/i18n';

export default function TagsRoute() {
	return (
		<Page title={ translate( 'Tags' ) }>
			<TagsList />
		</Page>
	);
}

TagsRoute.prepareRoute = () => [
	requestTags()
];
