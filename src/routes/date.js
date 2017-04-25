/**
 * External dependencies
 */
import { createElement } from 'preact';
import { connect } from 'preact-redux';
import { sortBy, map } from 'lodash';

/**
 * Internal dependencies
 */
import { USER_ID } from 'constant';
import { formatSiteDate } from 'lib/i18n';
import QueryUsers from 'components/query-users';
import Page from 'components/page';
import DateNavigation from 'components/date-navigation';
import UserDones from 'components/user-dones';
import { getUsers, getRouteParam } from 'state/selectors';

function DateRoute( { date, users } ) {
	// Sort users by current user first, then alphabetically by name
	const sortedUsers = sortBy( users, [
		( { id } ) => id === USER_ID ? 0 : 1,
		'name'
	] );

	return (
		<Page title={ formatSiteDate( date ) }>
			<QueryUsers />
			<DateNavigation date={ date } />
			{ map( sortedUsers, ( user ) => (
				<UserDones
					key={ user.id }
					date={ date }
					userId={ user.id } />
			) ) }
		</Page>
	);
}

export default connect( ( state ) => ( {
	users: getUsers( state ),
	date: getRouteParam( state, 'date' )
} ) )( DateRoute );
