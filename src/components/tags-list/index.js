/**
 * External dependencies
 */
import { createElement } from 'preact';
import { connect } from 'preact-redux';
import { map } from 'lodash';

/**
 * Internal dependencies
 */
import QueryTags from 'components/query-tags';
import Card from 'components/card';
import Button from 'components/button';
import Placeholder from 'components/placeholder';
import { translate } from 'lib/i18n';
import { hasReceivedTags, getTags } from 'state/selectors';

function TagsList( { hasReceived, tags } ) {
	return (
		<Card title={ translate( 'Recent Tags' ) }>
			<QueryTags />
			{ ! hasReceived && <Placeholder height={ 100 } /> }
			<ul className="tags-list__list">
				{ map( tags, ( name ) => (
					<li key={ name } className="tags-list__list-item">
						<Button to={ `/tags/${ name }/` }>
							{ name }
						</Button>
					</li>
				) ) }
			</ul>
		</Card>
	);
}

export default connect( ( state ) => ( {
	hasReceived: hasReceivedTags( state ),
	tags: getTags( state )
} ) )( TagsList );
