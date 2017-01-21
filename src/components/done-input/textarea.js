/**
 * External dependencies
 */
import { h, Component } from 'preact';
import autosize from 'autosize';
import caret from 'textarea-caret';
import { size } from 'lodash';

/**
 * Internal dependencies
 */
import PopoverMenu from 'components/popover-menu';

export default class DoneInputTextarea extends Component {
	static defaultProps = {
		onSuggestionSelected: () => {},
		onInput: () => {}
	}

	state = {
		hasFocus: false
	};

	componentDidMount() {
		const { autoFocus, selectionOffset } = this.props;

		if ( autoFocus ) {
			this.textarea.focus();
		}

		if ( selectionOffset ) {
			const [ start, stop ] = selectionOffset;
			this.textarea.setSelectionRange( start, stop );
		}

		autosize( this.textarea );
	}

	componentWillUnmount() {
		autosize.destroy( this.textarea );
	}

	componentDidUpdate( prevProps ) {
		const { value, selectionOffset } = this.props;

		if ( value !== prevProps.value ) {
			this.resize();
		}

		if ( selectionOffset && selectionOffset !== prevProps.selectionOffset ) {
			const [ start, stop ] = selectionOffset;
			this.textarea.setSelectionRange( start, stop );
		}
	}

	resize() {
		autosize.update( this.textarea );
	}

	setRef = ( textarea ) => this.textarea = textarea;

	toggleFocus = ( event ) => {
		this.setState( {
			hasFocus: document.activeElement === event.target
		} );
	};

	setCaretOffset = ( event ) => {
		const { target } = event;
		const { left, top } = caret( target, target.selectionEnd );
		const { lineHeight } = window.getComputedStyle( target );
		this.setState( {
			style: {
				top: top + parseInt( lineHeight, 10 ) - target.clientHeight,
				left: left - 13
			}
		} );

		this.props.onInput( event );
	};

	onSelect = ( suggestion ) => {
		this.props.onSuggestionSelected( suggestion, this.textarea.selectionStart );
	};

	render() {
		const { suggestions } = this.props;
		const { hasFocus, style } = this.state;

		return (
			<div className="done-input__textarea">
				<textarea
					ref={ this.setRef }
					{ ...this.props }
					onInput={ this.setCaretOffset }
					onFocus={ this.toggleFocus }
					onFocusOut={ this.toggleFocus }
					className="done-input__textarea-input" />
				<PopoverMenu
					isVisible={ hasFocus && size( suggestions ) > 0 }
					target={ this.textarea }
					position="bottom-left"
					selectKeyCode={ 9 }
					onSelect={ this.onSelect }
					items={ suggestions }
					style={ style } />
			</div>
		);
	}
}
