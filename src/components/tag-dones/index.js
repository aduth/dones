/**
 * External dependencies
 */
import { createElement } from 'preact';
import { connect } from 'preact-redux';
import { map, groupBy } from 'lodash';

/**
 * Internal dependencies
 */
import QueryUsers from 'components/query-users';
import QueryDones from 'components/query-dones';
import { getSortedDones } from 'state/selectors';
import TagDonesDate from './date';

function TagDones( { tag, dones } ) {
	return (
		<ul className="tag-dones">
			<QueryUsers />
			<QueryDones query={ { tag } } />
			{ map( groupBy( dones, 'date' ), ( dateDones, date ) => (
				<li key={ date }>
					<TagDonesDate
						date={ date }
						dones={ dateDones } />
				</li>
			) ) }
		</ul>
	);
}

export default connect( ( state, { tag } ) => ( {
	dones: getSortedDones( state, { tag } )
} ) )( TagDones );
