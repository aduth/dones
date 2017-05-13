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
import { translate } from 'lib/i18n';
import { getTags } from 'state/selectors';

function TagsList( { tags } ) {
	return (
		<Card title={ translate( 'Recent Tags' ) }>
			<QueryTags />
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
	tags: getTags( state )
} ) )( TagsList );
