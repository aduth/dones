/**
 * External dependencies
 */
import { Component, createElement } from 'preact';
import classcat from 'classcat';

export default class AutosizeTextarea extends Component {
	componentDidMount() {
		this.resize();
	}

	componentDidUpdate( prevProps ) {
		if ( this.props.value !== prevProps.value ) {
			this.resize();
		}
	}

	resize = () => {
		const { base } = this;
		base.style.height = '0';
		base.style.height = base.scrollHeight + 'px';
	};

	onInput = ( event ) => {
		this.resize();

		// Preserve original prop handler behavior
		const { onInput } = this.props;
		if ( onInput ) {
			onInput( event );
		}
	};

	render() {
		const { className } = this.props;
		const classes = classcat( [ 'autosize-textarea', className ] );

		return (
			<textarea
				{ ...this.props }
				onInput={ this.onInput }
				className={ classes }
			/>
		);
	}
}
