/**
 * External dependencies
 */
import { createElement, Component } from 'preact';
import { connect } from 'react-redux';

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
import { addDays, parseISO, format as formatDate } from 'date-fns';

class DateNavigation extends Component {
	getDateLink = ( increment ) => {
		const { date } = this.props;
		return `/date/${ formatDate( addDays( parseISO( date ), increment ), 'yyyy-MM-dd' ) }/`;
	};

	toDate = ( selected, date ) => {
		// Some date inputs on mobile allow clearing the value. Assume an empty
		// value should default to today's date.
		if ( ! date ) {
			date = formatDate( toSiteTime(), 'yyyy-MM-dd' );
		}

		this.props.pushRoute( `/date/${ date }/` );
	};

	render() {
		const { date } = this.props;

		return (
			<Card
				title={ translate( 'Dones' ) }
				subtitle={ formatSiteDate( date ) }
				controls={
					<ButtonGroup>
						<Button
							to={ this.getDateLink( -1 ) }
							aria-label={ translate( 'Previous' ) }
							preload>
							<Icon icon="chevron-left" size={ 12 } />
						</Button>
						<Button
							to={ this.getDateLink( 1 ) }
							aria-label={ translate( 'Next' ) }
							preload>
							<Icon icon="chevron-right" size={ 12 } />
						</Button>
						<DatePicker
							value={ date }
							onChange={ this.toDate } />
					</ButtonGroup>
				}
				className="date-navigation" />
		);
	}
}

export default connect( null, { pushRoute } )( DateNavigation );
