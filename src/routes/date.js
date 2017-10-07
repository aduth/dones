/**
 * External dependencies
 */
import { createElement } from 'preact';
import { connect } from 'preact-redux';
import { sortBy, map, compact } from 'lodash';

/**
 * Internal dependencies
 */
import { USER_ID } from 'constant';
import { formatSiteDate } from 'lib/i18n';
import { requestUsers } from 'state/users/actions';
import { requestDones } from 'state/dones/actions';
import { requestTags } from 'state/tags/actions';
import Page from 'components/page';
import DateNavigation from 'components/date-navigation';
import UserDones from 'components/user-dones';
import { getUsers, getRouteParam } from 'state/selectors';

function DateRoute( { date, users } ) {
	// Sort users by current user first, then alphabetically by name
	const sortedUsers = sortBy( users, [
		( { id } ) => id === USER_ID ? 0 : 1,
		'name',
	] );

	return (
		<Page title={ formatSiteDate( date ) }>
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

DateRoute.prepareRoute = ( { params } ) => compact( [
	requestUsers(),
	requestDones( { date: params.date } ),
	USER_ID && requestTags(),
] );

export default connect( ( state ) => ( {
	users: getUsers( state ),
	date: getRouteParam( state, 'date' ),
} ) )( DateRoute );
