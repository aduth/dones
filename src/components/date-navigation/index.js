/**
 * External dependencies
 */
import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import moment from 'moment';

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

class DateNavigation extends Component {
	constructor() {
		super( ...arguments );

		this.toPreviousDate = this.incrementDate.bind( this, -1 );
		this.toNextDate = this.incrementDate.bind( this, 1 );
	}

	incrementDate( multiplier ) {
		const { date } = this.props;
		const nextDate = moment( date ).add( 1 * multiplier, 'days' ).format( 'YYYY-MM-DD' );
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
							❮
							<span className="date-navigation__screen-reader-text">
								{ translate( 'Previous' ) }
							</span>
						</Button>
						<Button onClick={ this.toNextDate }>
							❯
							<span className="date-navigation__screen-reader-text">
								{ translate( 'Next' ) }
							</span>
						</Button>
						<Button
							className="date-navigation__picker">
							<span className="date-navigation__screen-reader-text">
								{ translate( 'Pick Date' ) }
							</span>
							<DatePicker
								className="date-navigation__picker-input"
								value={ date }
								onChange={ this.toDate } />
							<Icon
								icon="calendar"
								size={ 12 } />
						</Button>
					</ButtonGroup>
				}
				className="date-navigation" />
		);
	}
}

export default connect( null, { pushRoute } )( DateNavigation );
