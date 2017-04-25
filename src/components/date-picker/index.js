/**
 * External dependencies
 */
import { createElement, Component } from 'preact';
import Flatpickr from 'flatpickr';
import { omit } from 'lodash';

export default class DateTimePicker extends Component {
	static defaultProps = {
		options: {}
	};

	componentWillReceiveProps( nextProps ) {
		if ( nextProps.value ) {
			this.flatpickr.setDate( nextProps.value );
		}
	}

	componentDidMount() {
		const options = {
			...this.props.options,
			onChange: this.props.onChange
		};

		this.flatpickr = new Flatpickr( this.input, options );
	}

	setInputRef = ( input ) => {
		this.input = input;
	}

	render() {
		const { defaultValue, value, ...props } = this.props;

		return (
			<input
				{ ...omit( props, 'onChange', 'options' ) }
				defaultValue={ defaultValue || value }
				ref={ this.setInputRef } />
		);
	}
}
