/**
 * External dependencies
 */
import { createElement, Component } from 'preact';
import caret from 'textarea-caret';

/**
 * Internal dependencies
 */
import { translate } from 'lib/i18n';
import AutosizeTextarea from 'components/autosize-textarea';
import PopoverMenu from 'components/popover-menu';

export default class DoneInputTextarea extends Component {
	static defaultProps = {
		onSuggestionSelected: () => {},
		onInput: () => {},
	}

	componentDidMount() {
		const { autoFocus, selectionOffset } = this.props;

		if ( autoFocus ) {
			this.textarea.base.focus();
		}

		if ( selectionOffset ) {
			const [ start, stop ] = selectionOffset;
			this.textarea.base.setSelectionRange( start, stop );
		}
	}

	componentDidUpdate( prevProps ) {
		const { selectionOffset } = this.props;
		if ( selectionOffset && selectionOffset !== prevProps.selectionOffset ) {
			const [ start, stop ] = selectionOffset;
			this.textarea.base.setSelectionRange( start, stop );
		}
	}

	bindTextarea = ( textarea ) => this.textarea = textarea;

	setCaretOffset = ( event ) => {
		// Calculate caret offset for use in positioning suggestions menu
		const { target } = event;
		const { lineHeight } = window.getComputedStyle( target );
		let { left, top } = caret( target, target.selectionEnd );
		left -= 13;
		top += parseInt( lineHeight, 10 ) - target.clientHeight;
		this.setState( {
			style: {
				transform: `translate( ${ left }px, ${ top }px )`,
			},
		} );

		this.props.onInput( event );
	};

	onSelectSuggestion = ( suggestion ) => {
		// Insert suggestion at current caret index
		this.props.onSuggestionSelected( suggestion, this.textarea.base.selectionStart );

		// If suggestion inserted via click on PopoverMenu, preserve focus
		setTimeout( () => this.textarea.base && this.textarea.base.focus() );
	};

	render() {
		const { suggestions, value, onKeyDown } = this.props;
		const { style } = this.state;

		return (
			<div className="done-input__textarea">
				<AutosizeTextarea
					ref={ this.bindTextarea }
					value={ value }
					onKeyDown={ onKeyDown }
					rows="1"
					onInput={ this.setCaretOffset }
					className="done-input__textarea-input"
					aria-label={ translate( 'Done or goal' ) }
					placeholder={ translate( 'What have you been up to?' ) } />
				<PopoverMenu
					position="bottom right"
					selectKeyCode={ 9 }
					onSelect={ this.onSelectSuggestion }
					items={ suggestions }
					style={ style } />
			</div>
		);
	}
}
