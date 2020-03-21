/**
 * External dependencies
 */
import { useState, useRef } from 'preact/hooks';
import { useSelector, useStore } from 'prsh';
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

function DonesList( { query, userId } ) {
	const [ editing, setEditing ] = useState( null );
	const [ editOffset, setEditOffset ] = useState( null );
	const pendingEdit = useRef();
	const dones = useSelector( ( state ) =>
		getDonesForUser( state, query, userId )
	);
	const hasReceived = useSelector( ( state ) =>
		hasReceivedDones( state, query )
	);
	const { dispatch } = useStore();

	const isEditable = userId === USER_ID;

	function startTrackingSelection( event, id ) {
		if ( ! isEditable ) {
			return;
		}

		pendingEdit.current = id;

		// Continue tracking selection on DoneText until mouse released
		event.currentTarget.addEventListener(
			'mouseup',
			stopTrackingSelection,
			true
		);
	}

	function stopTrackingSelection( event ) {
		event.currentTarget.removeEventListener(
			'mouseup',
			stopTrackingSelection,
			true
		);

		if ( ! isEditable ) {
			return;
		}

		if ( 'A' !== event.target.nodeName ) {
			editDone(
				pendingEdit.current,
				getSelectedOffset( event.currentTarget )
			);
		}

		delete pendingEdit.current;
	}

	function editIfNonePending( id ) {
		// Don't start edit if a selection is in progress. Otherwise it will
		// clobber the selection offset calculation.
		if ( ! pendingEdit.current && isEditable ) {
			editDone( id );
		}
	}

	function editDone( id, offset = 0 ) {
		setEditing( id );
		setEditOffset( offset );
	}

	const classes = classNames( [
		'dones-list',
		{
			'is-editable': isEditable,
		},
	] );

	const items = map( sortBy( dones, 'id' ), ( { id, text, done } ) => {
		const isEditing = id === editing;

		let children;
		if ( isEditing ) {
			children = (
				<DoneInput
					initialText={ text }
					initialDone={ done }
					initialSelectionOffset={ editOffset }
					id={ id }
					onCancel={ () => setEditing( null ) }
					onSubmit={ () => setEditing( null ) }
				/>
			);
		} else {
			let onFocus;
			if ( isEditable ) {
				onFocus = () => editIfNonePending( id );
			}

			children = [
				<DoneStatus
					done={ done }
					disabled={ ! isEditable }
					onToggle={ () =>
						dispatch( updateDone( id, text, ! done ) )
					}
				/>,
				<DoneText
					onFocus={ onFocus }
					onMouseDown={ ( event ) =>
						startTrackingSelection( event, id )
					}
				>
					{ text }
				</DoneText>,
			];
		}

		return (
			<li key={ id } className="dones-list__item">
				{ children }
			</li>
		);
	} );

	return (
		<ul className={ classes }>
			{ items }
			{ ! hasReceived && (
				<li className="dones-list__item is-placeholder" />
			) }
			{ hasReceived && 0 === dones.length && (
				<li>
					<em>{ translate( 'Nothing reported yet!' ) }</em>
				</li>
			) }
		</ul>
	);
}

export default DonesList;
