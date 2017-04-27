/**
 * External dependencies
 */
import { createElement } from 'preact';

/**
 * Internal dependencies
 */
import Page from 'components/page';
import TagsList from 'components/tags-list';

export default function TagsRoute() {
	return (
		<Page title="Tags">
			<TagsList />
		</Page>
	);
}
