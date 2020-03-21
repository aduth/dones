/**
 * External dependencies
 */
import { map, groupBy } from 'lodash';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import { formatSiteDate } from 'lib/i18n';
import TagDonesUser from './user';

export default function TagDonesDate( { date, dones } ) {
	return (
		<Card key={ date } title={ formatSiteDate( date ) }>
			<ul className="tag-dones__date-list">
				{ map( groupBy( dones, 'user' ), ( userDones, userId ) => (
					<li key={ userId } className="tag-dones__date-list-item">
						<TagDonesUser userId={ userId } dones={ userDones } />
					</li>
				) ) }
			</ul>
		</Card>
	);
}
