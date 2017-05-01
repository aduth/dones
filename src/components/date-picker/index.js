/**
 * External dependencies
 */
import { createElement, Component } from 'preact';
import Flatpickr from 'flatpickr';
import { omit } from 'lodash';

/**
 * Internal dependencies
 */
import { toSiteTime } from 'lib/i18n';

export default class DatePicker extends Component {
	static defaultProps = {
		options: {}
	};

	componentDidMount() {
		const options = {
			...this.props.options,
			onChange: this.props.onChange
		};

		this.flatpickr = new Flatpickr( this.input, options );

		// By default, Flatpickr intializes to the browser-offset date. Update
		// the value and force a redraw (to reapply the "today" class)
		this.flatpickr.now = toSiteTime( new Date() );
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
		const { defaultValue, value, ...props } = this.props;

		return (
			<div className="date-picker">
				<input
					{ ...omit( props, 'onChange', 'options' ) }
					defaultValue={ defaultValue || value }
					ref={ this.setInputRef } />
			</div>
		);
	}
}
