/**
 * External dependencies
 */
import { createElement, Component } from 'preact';
import { connect } from 'preact-redux';
import classNames from 'classnames';
import { map, sortBy, get } from 'lodash';

/**
 * Internal dependencies
 */
import { USER_ID } from 'constant';
import { translate } from 'lib/i18n';
import DoneStatus from 'components/done-status';
import DoneInput from 'components/done-input';
import DoneText from 'components/done-text';
import { updateDone } from 'state/dones/actions';
import { getDonesForUser, hasReceivedDones } from 'state/selectors';

class DonesList extends Component {
	state = {
		editing: null,
	};

	stopEditing = () => this.setState( { editing: null } );

	startTrackingSelection = ( id ) => {
		if ( ! this.isEditable() ) {
			return;
		}

		this.pendingEdit = id;
		document.addEventListener( 'mouseup', this.stopTrackingSelection, true );
	};

	stopTrackingSelection = ( event ) => {
		if ( ! this.isEditable() ) {
			return;
		}

		document.removeEventListener( 'mouseup', this.stopTrackingSelection, true );
		const editing = this.pendingEdit;
		delete this.pendingEdit;

		if ( 'A' === event.target.nodeName ) {
			return;
		}

		const { baseNode, baseOffset, extentNode, extentOffset } = document.getSelection();

		let start = 0, length;
		for ( const child of event.target.childNodes ) {
			if ( child === baseNode ) {
				start += baseOffset;
				length = 0;
			}

			// Text may be modified when displayed in list, with raw text
			// defined as attribute for calculating offset in edit
			const { attributes, textContent } = child;
			const rawText = get( attributes, 'data-raw-text.value', textContent );

			if ( child === extentNode ) {
				length += extentOffset;
			} else if ( undefined !== length ) {
				length += rawText.length;
			}

			if ( length && child === baseNode ) {
				length -= baseOffset;
			}

			if ( undefined !== length ) {
				break;
			}

			start += rawText.length;
		}

		this.editDone( editing, [
			start,
			start + ( length || 0 ),
		] );
	};

	editIfNonePending = ( id ) => {
		// Don't start edit if a selection is in progress. Otherwise it will
		// clobber the selection offset calculation.
		if ( ! this.pendingEdit && this.isEditable() ) {
			this.editDone( id );
		}
	};

	editDone = ( id, offset = 0 ) => {
		this.setState( {
			editing: id,
			editOffset: offset,
		} );
	};

	isEditable() {
		return this.props.userId === USER_ID;
	}

	render() {
		const { dones, hasReceived } = this.props;
		const { editing, editOffset } = this.state;
		const classes = classNames( 'dones-list', {
			'is-editable': this.isEditable(),
		} );

		const items = map( sortBy( dones, 'id' ), ( { id, text, done } ) => {
			const isEditing = ( id === editing );

			let children;
			if ( isEditing ) {
				children = (
					<DoneInput
						initialText={ text }
						initialDone={ done }
						selectionOffset={ editOffset }
						id={ id }
						onCancel={ this.stopEditing }
						onSubmit={ this.stopEditing } />
				);
			} else {
				children = [
					<DoneStatus
						done={ done }
						disabled={ ! this.isEditable() }
						onToggle={ () => this.props.updateDone( id, text, ! done ) } />,
					<DoneText
						onFocus={ () => this.editIfNonePending( id ) }
						onMouseDown={ () => this.startTrackingSelection( id ) }>
						{ text }
					</DoneText>,
				];
			}

			return (
				// TODO: Resolve buggy lint behavior
				// eslint-disable-next-line wpcalypso/jsx-classname-namespace
				<li key={ id } className="dones-list__item">
					{ children }
				</li>
			);
		} );

		return (
			<ul className={ classes }>
				{ items }
				{ ! hasReceived && <li className="dones-list__item is-placeholder" /> }
				{ hasReceived && 0 === dones.length && (
					<li><em>{ translate( 'Nothing reported yet!' ) }</em></li>
				) }
			</ul>
		);
	}
}

export default connect(
	( state, { query, userId } ) => ( {
		dones: getDonesForUser( state, query, userId ),
		hasReceived: hasReceivedDones( state, query ),
	} ),
	{ updateDone }
)( DonesList );
