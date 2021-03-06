/**
 * External dependencies
 */
import { useSelector } from 'prsh';
import { map } from 'lodash';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import Button from 'components/button';
import Placeholder from 'components/placeholder';
import { translate } from 'lib/i18n';
import { hasReceivedTags, getTags } from 'state/selectors';

function TagsList() {
	const hasReceived = useSelector( hasReceivedTags );
	const tags = useSelector( getTags );

	return (
		<Card title={ translate( 'Recent Tags' ) }>
			{ ! hasReceived && <Placeholder height={ 100 } /> }
			<ul className="tags-list__list">
				{ hasReceived && ! tags.length && (
					<li>
						<em>{ translate( 'No tags found' ) }</em>
					</li>
				) }
				{ map( tags, ( name ) => (
					<li key={ name } className="tags-list__list-item">
						<Button to={ `/tags/${ name }/` } preload>
							{ name }
						</Button>
					</li>
				) ) }
			</ul>
		</Card>
	);
}

export default TagsList;
