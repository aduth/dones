/**
 * External dependencies
 */
import { createElement, Component } from 'preact';
import { connect } from 'preact-redux';
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

export class DoneInput extends Component {
	static defaultProps = {
		initialDone: true,
		initialText: '',
		onCancel: () => {},
		onSubmit: () => {},
	};

	constructor( props ) {
		super( ...arguments );

		this.state = {
			done: props.initialDone,
			text: props.initialText,
			selectionOffset: props.initialSelectionOffset,
		};
	}

	isEditing() {
		return !! this.props.id;
	}

	getTagFragment( textarea ) {
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

	setFormRef = ( component ) => {
		this.form = component;
	};

	toggleStatus = ( done ) => {
		this.setState( { done } );
	};

	setText = ( event ) => {
		const text = event.target.value.replace( /[\n\r]/g, '' );

		this.setState( {
			text,
			tagFragment: this.getTagFragment( event.target ),
		} );
	};

	insertSuggestion = ( suggestion, index ) => {
		const { tagFragment, text } = this.state;
		if ( ! tagFragment ) {
			return;
		}

		// Changing text state will move cursor to end of input, so assign
		// temporary instance variable to force offset to be preserved
		const offsetIndex = index - tagFragment.length + suggestion.length + 1;

		this.setState( {
			text: [
				// Append suggestion to text up to and including hash character
				text.substr( 0, index - tagFragment.length ) + suggestion,
				// Concatenate with remainder of original text
				text.substr( index ).replace( /^ /, '' ),
			].join( ' ' ),
			tagFragment: null,
			selectionOffset: [ offsetIndex, offsetIndex ],
		} );
	};

	maybeSubmit = ( event ) => {
		switch ( event.keyCode ) {
			case 13: // Enter
				this.submit( event );
				break;

			case 27: // Escape
				this.props.onCancel();
				break;
		}
	};

	delete = () => {
		const { id } = this.props;
		if ( confirm( translate( 'Are you sure you want to delete this done?' ) ) ) {
			this.props.onDelete( id );
		}
	};

	submit = ( event ) => {
		const { id, date, initialText, initialDone } = this.props;
		const { done } = this.state;
		const text = this.state.text.trim();

		if ( event ) {
			event.preventDefault();
		}

		this.props.onSubmit();

		if ( text === initialText && done === initialDone ) {
			return;
		}

		if ( this.isEditing() ) {
			this.props.updateDone( id, text, done );
		} else if ( text ) {
			this.props.createDone( date, text, done );
		}

		this.setState( {
			text: this.constructor.defaultProps.initialText,
			tagFragment: null,
		} );
	};

	selectText( event ) {
		event.target.select();
	}

	getSuggestions() {
		const { tagFragment } = this.state;
		if ( ! tagFragment ) {
			return [];
		}

		const { tags } = this.props;
		const search = tagFragment.toLowerCase();

		// Find by fragment included in tag (maximum 5)
		const suggestions = transform( tags, ( memo, tag ) => {
			if ( includes( tag.toLowerCase(), search ) ) {
				memo.push( tag );
			}

			return memo.length < 5;
		}, [] );

		// Sort by index of fragment in tag
		return sortBy( suggestions, ( suggestion ) => {
			return suggestion.toLowerCase().indexOf( search );
		} );
	}

	render() {
		const { className, onCancel, hasNavigated } = this.props;
		const { text, selectionOffset } = this.state;
		const isEditing = this.isEditing();

		const classes = classNames( [ 'done-input', className, {
			'is-editing': isEditing,
		} ] );

		const actions = [ {
			type: 'submit',
			primary: true,
			'aria-label': translate( 'Submit' ),
			children: translate( 'Submit' ),
			disabled: text.length === 0,
		} ];

		if ( isEditing ) {
			actions.push( {
				onClick: this.delete,
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
			<form
				ref={ this.setFormRef }
				className={ classes }
				onSubmit={ this.submit }>
				<DoneStatus
					onToggle={ this.toggleStatus }
					done={ this.state.done } />
				<DoneInputTextarea
					value={ text }
					onInput={ this.setText }
					onKeyDown={ this.maybeSubmit }
					onSuggestionSelected={ this.insertSuggestion }
					selectionOffset={ selectionOffset }
					suggestions={ this.getSuggestions() }
					autoFocus={ ! hasNavigated } />
				<div className="done-input__actions">
					{ map( actions, ( action, i ) => (
						<Button
							key={ [ 'action', i ].join() }
							className="done-input__action"
							{ ...action } />
					) ) }
				</div>
			</form>
		);
	}
}

export default connect(
	( state ) => ( {
		hasNavigated: ! isInitialRoute( state ),
		tags: getTags( state ),
	} ),
	{
		createDone,
		updateDone,
		onDelete: deleteDone,
	}
)( DoneInput );
