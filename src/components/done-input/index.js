/**
 * External dependencies
 */
import { createElement, Component } from 'preact';
import { connect } from 'preact-redux';
import classNames from 'classnames';
import { last, map, transform, includes } from 'lodash';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import Icon from 'components/icon';
import DoneStatus from 'components/done-status';
import DoneInputTextarea from './textarea';
import { createDone, updateDone, deleteDone } from 'state/dones/actions';
import { translate } from 'lib/i18n';
import { getTags } from 'state/selectors';

class DoneInput extends Component {
	static defaultProps = {
		initialDone: true,
		initialText: '',
		onCancel: () => {},
		onSubmit: () => {}
	};

	constructor( props ) {
		super( ...arguments );

		this.state = {
			done: props.initialDone,
			text: props.initialText
		};
	}

	componentDidMount() {
		this.attachEventHandler();
	}

	componentDidUpdate() {
		this.attachEventHandler();

		// Clear temporary suggestion offset after assigned
		delete this._suggestionOffset;
	}

	componentWillUnmount() {
		document.removeEventListener( 'click', this.checkClickOutside );
	}

	attachEventHandler() {
		if ( this.isEditing() ) {
			document.addEventListener( 'click', this.checkClickOutside, true );
		}
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

	checkClickOutside = ( event ) => {
		if ( this.isEditing() && this.form && ! this.form.contains( event.target ) ) {
			this.props.onCancel();
		}
	};

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
			tagFragment: this.getTagFragment( event.target )
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
		this._suggestionOffset = [ offsetIndex, offsetIndex ];

		this.setState( {
			text: [
				// Append suggestion to text up to and including hash character
				text.substr( 0, index - tagFragment.length ) + suggestion,
				// Concatenate with remainder of original text
				text.substr( index ).replace( /^ /, '' )
			].join( ' ' ),
			tagFragment: null
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
			tagFragment: null
		} );
	};

	selectText( event ) {
		event.target.select();
	}

	render() {
		const { className, onCancel, selectionOffset, tags } = this.props;
		const { text, tagFragment } = this.state;
		const classes = classNames( 'done-input', className );
		const actions = [ {
			type: 'submit',
			primary: true,
			'aria-label': translate( 'Submit' ),
			children: [
				<Icon icon="paper-plane" size={ 12 } />,
				<span className="done-input__action-text">
					{ translate( 'Submit' ) }
				</span>
			],
			disabled: text.length === 0
		} ];

		if ( this.isEditing() ) {
			actions.push( {
				onClick: onCancel,
				'aria-label': translate( 'Cancel' ),
				children: [
					<Icon icon="times" size={ 12 } />,
					<span className="done-input__action-text">
						{ translate( 'Cancel' ) }
					</span>
				]
			} );
		}

		let suggestions;
		if ( tagFragment ) {
			// Find by fragment included in tag (maximum 5)
			suggestions = transform( tags, ( memo, tag ) => {
				if ( includes( tag, tagFragment ) ) {
					memo.push( tag );
				}

				return memo.length < 5;
			}, [] );

			// Sort by index of fragment in tag
			suggestions.sort( ( a, b ) => a.indexOf( tagFragment ) - b.indexOf( tagFragment ) );
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
					selectionOffset={ this._suggestionOffset || selectionOffset }
					suggestions={ suggestions }
					autoFocus />
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
		tags: getTags( state )
	} ),
	{
		createDone,
		updateDone,
		deleteDone
	}
)( DoneInput );
