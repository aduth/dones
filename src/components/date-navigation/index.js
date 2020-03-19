/**
 * External dependencies
 */
import { createElement } from 'preact';
import { date as phpdate } from 'phpdate';
import { useStore } from 'prsh';

/**
 * Internal dependencies
 */
import ButtonGroup from 'components/button-group';
import Button from 'components/button';
import Card from 'components/card';
import Icon from 'components/icon';
import DatePicker from 'components/date-picker';
import { toSiteTime, formatSiteDate, translate } from 'lib/i18n';
import { pushRoute } from 'state/routing/actions';

function DateNavigation( { date } ) {
	const { dispatch } = useStore();

	function getDateLink( increment ) {
		const linkDate = toSiteTime( new Date( date ) );
		linkDate.setDate( linkDate.getDate() + increment );
		return `/date/${ phpdate( 'Y-m-d', linkDate ) }/`;
	}

	function toDate( selected, nextDate ) {
		// Some date inputs on mobile allow clearing the value. Assume an empty
		// value should default to today's date.
		if ( ! nextDate ) {
			nextDate = phpdate( 'Y-m-d', toSiteTime() );
		}

		dispatch( pushRoute( `/date/${ nextDate }/` ) );
	}

	return (
		<Card
			title={ translate( 'Dones' ) }
			subtitle={ formatSiteDate( date ) }
			controls={
				<ButtonGroup>
					<Button
						to={ getDateLink( -1 ) }
						aria-label={ translate( 'Previous' ) }
						preload
					>
						<Icon icon="chevron-left" size={ 12 } />
					</Button>
					<Button
						to={ getDateLink( 1 ) }
						aria-label={ translate( 'Next' ) }
						preload
					>
						<Icon icon="chevron-right" size={ 12 } />
					</Button>
					<DatePicker value={ date } onChange={ toDate } />
				</ButtonGroup>
			}
			className="date-navigation"
		/>
	);
}

export default DateNavigation;
