/**
 * External dependencies
 */
import { useRef, useState, useEffect } from 'preact/hooks';
import caret from 'textarea-caret';

/**
 * Internal dependencies
 */
import { translate } from 'lib/i18n';
import AutosizeTextarea from 'components/autosize-textarea';
import PopoverMenu from 'components/popover-menu';

function DoneInputTextarea( {
	onSuggestionSelected = () => {},
	onInput = () => {},
	autoFocus,
	selectionOffset,
	suggestions,
	value,
	onKeyDown,
} ) {
	const textarea = useRef();
	const [ style, setStyle ] = useState();

	useEffect( () => {
		if ( autoFocus ) {
			textarea.current.base.focus();
		}
	}, [] );

	useEffect( () => {
		if ( selectionOffset ) {
			const [ start, stop ] = selectionOffset;
			textarea.current.base.setSelectionRange( start, stop );
		}
	}, [ selectionOffset ] );

	function setCaretOffset( event ) {
		// Calculate caret offset for use in positioning suggestions menu
		const { target } = event;
		const { lineHeight } = window.getComputedStyle( target );
		let { left, top } = caret( target, target.selectionEnd );
		left -= 13;
		top += parseInt( lineHeight, 10 ) - target.clientHeight;
		setStyle( {
			transform: `translate( ${ left }px, ${ top }px )`,
		} );

		onInput( event );
	}

	function onSelectSuggestion( suggestion ) {
		// Insert suggestion at current caret index
		onSuggestionSelected(
			suggestion,
			textarea.current.base.selectionStart
		);

		// If suggestion inserted via click on PopoverMenu, preserve focus
		setTimeout(
			() => textarea.current.base && textarea.current.base.focus()
		);
	}

	return (
		<div className="done-input__textarea">
			<AutosizeTextarea
				ref={ textarea }
				value={ value }
				onKeyDown={ onKeyDown }
				rows="1"
				onInput={ setCaretOffset }
				className="done-input__textarea-input"
				aria-label={ translate( 'Done or goal' ) }
				placeholder={ translate( 'What have you been up to?' ) }
			/>
			<PopoverMenu
				position="bottom right"
				selectKeyCode={ 9 }
				onSelect={ onSelectSuggestion }
				items={ suggestions }
				style={ style }
			/>
		</div>
	);
}

export default DoneInputTextarea;
