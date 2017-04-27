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
import WordCloud from 'components/word-cloud';
import { getTagCounts } from 'state/selectors';

function TagsList( { tags } ) {
	return (
		<Card>
			<QueryTags />
			<WordCloud items={ map( tags, ( count, name ) => ( {
				text: name,
				url: `/tags/${ name }`,
				count
			} ) ) } />
		</Card>
	);
}

export default connect( ( state ) => ( {
	tags: getTagCounts( state )
} ) )( TagsList );
