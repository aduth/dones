/**
 * External dependencies
 */
import { useState } from 'preact/hooks';
import { useSelector, useStore } from 'prsh';
import classNames from 'classcat';
import { last, map, transform, sortBy, includes } from 'lodash';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import DoneStatus from 'components/done-status';
import DoneInputTextarea from './textarea';
import { createDone, updateDone, deleteDone } from 'state/dones/actions';
import { translate } from 'lib/i18n';
import { getTags, isInitialRoute } from 'state/selectors';

function DoneInput( {
	initialDone = true,
	initialText = '',
	initialSelectionOffset,
	onCancel = () => {},
	onSubmit = () => {},
	id,
	date,
	className,
} ) {
	const [ done, setDone ] = useState( initialDone );
	const [ text, setText ] = useState( initialText );
	const [ selectionOffset, setSelectionOffset ] = useState(
		initialSelectionOffset
	);
	const [ tagFragment, setTagFragment ] = useState( null );
	const hasNavigated = useSelector( ( state ) => ! isInitialRoute( state ) );
	const tags = useSelector( getTags );
	const { dispatch } = useStore();

	const isEditing = !! id;

	function getTagFragment( textarea ) {
		const { selectionStart, selectionEnd, value } = textarea;

		// Only tracking fragments if not a selection range
		if ( selectionStart !== selectionEnd ) {
			return null;
		}

		// Find word as sequence preceding caret 'til next space
		const word = last( value.substr( 0, selectionStart ).split( ' ' ) );

		// Only consider as tag fragment if sequence starts with hash
		if ( '#' !== word[ 0 ] ) {
			return null;
		}

		return word.substr( 1 );
	}

	function toggleStatus( nextDone ) {
		setDone( nextDone );
	}

	function setTextFromInput( event ) {
		const nextText = event.target.value.replace( /[\n\r]/g, '' );

		setText( nextText );
		setTagFragment( getTagFragment( event.target ) );
	}

	function insertSuggestion( suggestion, index ) {
		if ( ! tagFragment ) {
			return;
		}

		// Changing text state will move cursor to end of input, so assign
		// temporary instance variable to force offset to be preserved
		const offsetIndex = index - tagFragment.length + suggestion.length + 1;

		setText(
			[
				// Append suggestion to text up to and including hash character
				text.substr( 0, index - tagFragment.length ) + suggestion,
				// Concatenate with remainder of original text
				text.substr( index ).replace( /^ /, '' ),
			].join( ' ' )
		);
		setTagFragment( null );
		setSelectionOffset( [ offsetIndex, offsetIndex ] );
	}

	function maybeSubmit( event ) {
		switch ( event.keyCode ) {
			case 13: // Enter
				submit( event );
				break;

			case 27: // Escape
				onCancel();
				break;
		}
	}

	function confirmAndDelete() {
		if (
			// eslint-disable-next-line no-alert
			confirm( translate( 'Are you sure you want to delete this done?' ) )
		) {
			dispatch( deleteDone( id ) );
		}
	}

	function submit( event ) {
		const trimmedText = text.trim();

		if ( event ) {
			event.preventDefault();
		}

		onSubmit();

		if ( trimmedText === initialText && done === initialDone ) {
			return;
		}

		if ( isEditing ) {
			dispatch( updateDone( id, trimmedText, done ) );
		} else if ( trimmedText ) {
			dispatch( createDone( date, trimmedText, done ) );
		}

		setText( '' );
		setTagFragment( null );
	}

	function getSuggestions() {
		if ( ! tagFragment ) {
			return [];
		}

		const search = tagFragment.toLowerCase();

		// Find by fragment included in tag (maximum 5)
		const suggestions = transform(
			tags,
			( memo, tag ) => {
				if ( includes( tag.toLowerCase(), search ) ) {
					memo.push( tag );
				}

				return memo.length < 5;
			},
			[]
		);

		// Sort by index of fragment in tag
		return sortBy( suggestions, ( suggestion ) => {
			return suggestion.toLowerCase().indexOf( search );
		} );
	}

	const classes = classNames( [
		'done-input',
		className,
		{
			'is-editing': isEditing,
		},
	] );

	const actions = [
		{
			type: 'submit',
			primary: true,
			'aria-label': translate( 'Submit' ),
			children: translate( 'Submit' ),
			disabled: text.length === 0,
		},
	];

	if ( isEditing ) {
		actions.push( {
			onClick: confirmAndDelete,
			'aria-label': translate( 'Delete' ),
			children: translate( 'Delete' ),
			dangerous: true,
		} );

		actions.push( {
			onClick: onCancel,
			'aria-label': translate( 'Cancel' ),
			children: translate( 'Cancel' ),
		} );
	}

	return (
		<form className={ classes } onSubmit={ submit }>
			<DoneStatus onToggle={ toggleStatus } done={ done } />
			<DoneInputTextarea
				value={ text }
				onInput={ setTextFromInput }
				onKeyDown={ maybeSubmit }
				onSuggestionSelected={ insertSuggestion }
				selectionOffset={ selectionOffset }
				suggestions={ getSuggestions() }
				// eslint-disable-next-line jsx-a11y/no-autofocus
				autoFocus={ ! hasNavigated }
			/>
			<div className="done-input__actions">
				{ map( actions, ( action, i ) => (
					<Button
						key={ [ 'action', i ].join() }
						className="done-input__action"
						{ ...action }
					/>
				) ) }
			</div>
		</form>
	);
}

export default DoneInput;
