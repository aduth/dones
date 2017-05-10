/**
 * External dependencies
 */
import { createElement, Component } from 'preact';
import { connect } from 'preact-redux';

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
import { addDays, format as formatDate } from 'date-fns';

class DateNavigation extends Component {
	constructor() {
		super( ...arguments );

		this.toPreviousDate = this.incrementDate.bind( this, -1 );
		this.toNextDate = this.incrementDate.bind( this, 1 );
	}

	incrementDate( multiplier ) {
		const { date } = this.props;
		const nextDate = formatDate( addDays( date, 1 * multiplier ), 'YYYY-MM-DD' );
		this.props.pushRoute( `/date/${ nextDate }/` );
	}

	toDate = ( selected, date ) => {
		// Some date inputs on mobile allow clearing the value. Assume an empty
		// value should default to today's date.
		if ( ! date ) {
			date = formatDate( toSiteTime(), 'YYYY-MM-DD' );
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
							aria-label={ translate( 'Previous' ) }
							onClick={ this.toPreviousDate }>
							<Icon icon="chevron-left" size={ 12 } />
						</Button>
						<Button
							aria-label={ translate( 'Next' ) }
							onClick={ this.toNextDate }>
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
