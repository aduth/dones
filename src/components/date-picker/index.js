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
		options: {},
	};

	componentDidMount() {
		// Profiling shows that Flatpickr takes a non-trivial amount of time to
		// initialize, so let's defer it to the next available frame.
		if ( window.requestAnimationFrame ) {
			this.scheduledInitialize = window.requestAnimationFrame( this.initialize );
		} else {
			this.initialize();
		}
	}

	componentWillReceiveProps( nextProps ) {
		if ( this.flatpickr && nextProps.value ) {
			this.flatpickr.setDate( nextProps.value );
		}
	}

	componentWillUnmount() {
		if ( this.flatpickr ) {
			this.flatpickr.destroy();
		} else {
			window.cancelAnimationFrame( this.initialize );
		}
	}

	shouldComponentUpdate() {
		return false;
	}

	initialize = () => {
		this.flatpickr = new Flatpickr( this.input, {
			onChange: this.props.onChange,
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
	};

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
