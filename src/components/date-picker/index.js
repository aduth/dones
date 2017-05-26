/**
 * External dependencies
 */
import { createElement, Component } from 'preact';
import Flatpickr from 'flatpickr';

/**
 * Internal dependencies
 */
import { toSiteTime, translate } from 'lib/i18n';
import Icon from 'components/icon';

export default class DatePicker extends Component {
	static defaultProps = {
		options: {}
	};

	componentDidMount() {
		this.flatpickr = new Flatpickr( this.input, {
			onChange: this.props.onChange
		} );

		// By default, Flatpickr intializes to the browser-offset date. Update
		// the value and force a redraw (to reapply the "today" class)
		this.flatpickr.now = toSiteTime( new Date() );

		// Override Flatpickr's mobile accessibility attributes to inherit more
		// from the base input element
		const { input, mobileInput } = this.flatpickr;
		if ( mobileInput ) {
			mobileInput.removeAttribute( 'tabindex' );
			mobileInput.setAttribute( 'aria-label', input.getAttribute( 'aria-label' ) );
			input.setAttribute( 'aria-hidden', 'true' );
		}

		this.flatpickr.redraw();
	}

	componentWillReceiveProps( nextProps ) {
		if ( nextProps.value ) {
			this.flatpickr.setDate( nextProps.value );
		}
	}

	componentWillUnmount() {
		this.flatpickr.destroy();
	}

	shouldComponentUpdate() {
		return false;
	}

	setInputRef = ( input ) => {
		this.input = input;
	};

	render() {
		const { value } = this.props;

		return (
			<span className="date-picker button">
				<Icon icon="calendar" size={ 12 } />
				<input
					defaultValue={ value }
					ref={ this.setInputRef }
					aria-label={ translate( 'Pick Date' ) }
					className="date-picker__input" />
			</span>
		);
	}
}
