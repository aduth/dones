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
import Link from 'components/link';
import { getTagCounts } from 'state/selectors';

function TagsList( { tags } ) {
	return (
		<ul>
			<QueryTags />
			{ map( tags, ( count, name ) => (
				<li key={ name }>
					<Link to={ `/tags/${ name }` }>
						{ name } ({ count })
					</Link>
				</li>
			) ) }
		</ul>
	);
}

export default connect( ( state ) => ( {
	tags: getTagCounts( state )
} ) )( TagsList );
