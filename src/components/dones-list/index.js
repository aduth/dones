/**
 * External dependencies
 */
import { createElement, Component } from 'preact';
import { connect } from 'preact-redux';
import classNames from 'classcat';
import { map, sortBy } from 'lodash';

/**
 * Internal dependencies
 */
import { USER_ID } from 'constant';
import { translate } from 'lib/i18n';
import { getSelectedOffset } from 'lib/selection';
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

	startTrackingSelection = ( event, id ) => {
		if ( ! this.isEditable() ) {
			return;
		}

		this.pendingEdit = id;

		// Continue traking selection on DoneText until mouse released
		event.currentTarget.addEventListener( 'mouseup', this.stopTrackingSelection, true );
	};

	stopTrackingSelection = ( event ) => {
		event.currentTarget.removeEventListener( 'mouseup', this.stopTrackingSelection, true );

		if ( ! this.isEditable() ) {
			return;
		}

		const editing = this.pendingEdit;
		delete this.pendingEdit;

		if ( 'A' !== event.target.nodeName ) {
			this.editDone( editing, getSelectedOffset( event.currentTarget ) );
		}
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
		const isEditable = this.isEditable();
		const classes = classNames( [ 'dones-list', {
			'is-editable': isEditable,
		} ] );

		const items = map( sortBy( dones, 'id' ), ( { id, text, done } ) => {
			const isEditing = ( id === editing );

			let children;
			if ( isEditing ) {
				children = (
					<DoneInput
						initialText={ text }
						initialDone={ done }
						initialSelectionOffset={ editOffset }
						id={ id }
						onCancel={ this.stopEditing }
						onSubmit={ this.stopEditing } />
				);
			} else {
				let onFocus;
				if ( isEditable ) {
					onFocus = () => this.editIfNonePending( id );
				}

				children = [
					<DoneStatus
						done={ done }
						disabled={ ! this.isEditable() }
						onToggle={ () => this.props.updateDone( id, text, ! done ) } />,
					<DoneText
						onFocus={ onFocus }
						onMouseDown={ ( event ) => this.startTrackingSelection( event, id ) }>
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
