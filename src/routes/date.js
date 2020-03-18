/**
 * External dependencies
 */
import { createElement } from 'preact';
import { map, compact } from 'lodash';
import { useSelector } from 'prsh';

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
import { getSortedUsersByDate, getRouteParam } from 'state/selectors';

function DateRoute() {
	const date = useSelector( ( state ) => getRouteParam( state, 'date' ) );
	const users = useSelector( ( state ) => getSortedUsersByDate( state, date ) );

	return (
		<Page title={ formatSiteDate( date ) }>
			<DateNavigation date={ date } />
			{ map( users, ( user ) => (
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

export default DateRoute;
