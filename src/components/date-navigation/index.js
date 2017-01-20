/**
 * External dependencies
 */
import { h, Component } from 'preact';
import { connect } from 'preact-redux';

/**
 * Internal dependencies
 */
import ButtonGroup from 'components/button-group';
import Button from 'components/button';
import Card from 'components/card';
import Icon from 'components/icon';
import DatePicker from 'components/date-picker';
import { formatSiteDate, translate } from 'lib/i18n';
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
		this.props.pushRoute( `/date/${ date }/` );
	};

	render() {
		const { date } = this.props;

		return (
			<Card
				title="Dones"
				subtitle={ formatSiteDate( date ) }
				controls={
					<ButtonGroup>
						<Button onClick={ this.toPreviousDate }>
							<Icon
								icon="chevron-left"
								size={ 12 }>
								{ translate( 'Previous' ) }
							</Icon>
						</Button>
						<Button onClick={ this.toNextDate }>
							<Icon
								icon="chevron-right"
								size={ 12 }>
								{ translate( 'Next' ) }
							</Icon>
						</Button>
						<Button
							className="date-navigation__picker">
							<DatePicker
								className="date-navigation__picker-input"
								value={ date }
								onChange={ this.toDate } />
							<Icon
								icon="calendar"
								size={ 12 }>
								{ translate( 'Pick Date' ) }
							</Icon>
						</Button>
					</ButtonGroup>
				}
				className="date-navigation" />
		);
	}
}

export default connect( null, { pushRoute } )( DateNavigation );
