/**
 * External dependencies
 */
import { createElement } from 'preact';
import connect from 'components/connect';
import { isEmpty, map, groupBy } from 'lodash';

/**
 * Internal dependencies
 */
import { translate } from 'lib/i18n';
import Card from 'components/card';
import Placeholder from 'components/placeholder';
import { getSortedDones, hasReceivedDones } from 'state/selectors';
import TagDonesDate from './date';

function TagDones( { hasReceived, dones } ) {
	// We need to preserve time accuracy within date to enable sorting, but for
	// purposes of displaying grouped by date, we split between date and time
	// parts, pulling date (e.g. "2017-01-01 00:00:00" => "2017-01-01")
	function byDate( done ) {
		return done.date.split( ' ' )[ 0 ];
	}

	return (
		<ul className="tag-dones">
			{ ! hasReceived && (
				<li>
					<Card title={ <Placeholder /> }>
						<Placeholder />
					</Card>
				</li>
			) }
			{ hasReceived && isEmpty( dones ) && (
				<li>
					<Card>
						<em>{ translate( 'No dones found for this tag' ) }</em>
					</Card>
				</li>
			) }
			{ map( groupBy( dones, byDate ), ( dateDones, date ) => (
				<li key={ date }>
					<TagDonesDate date={ date } dones={ dateDones } />
				</li>
			) ) }
		</ul>
	);
}

export default connect( ( state, { query } ) => ( {
	dones: getSortedDones( state, query ),
	hasReceived: hasReceivedDones( state, query ),
} ) )( TagDones );
