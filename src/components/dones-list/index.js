/**
 * External dependencies
 */
import { h, Component } from 'preact';
import { connect } from 'preact-redux';
import classNames from 'classnames';
import { map, partial } from 'lodash';

/**
 * Internal dependencies
 */
import { USER_ID } from 'constant';
import { translate } from 'lib/i18n';
import QueryDones from 'components/query-dones';
import DoneStatus from 'components/done-status';
import DoneInput from 'components/done-input';
import Icon from 'components/icon';
import { toggleDone, deleteDone } from 'state/dones/actions';
import { getUserDones } from 'state/selectors';
import DonesListItemText from './item-text';

class DonesList extends Component {
	state = {
		editing: null
	};

	stopEditing = () => this.setState( { editing: null } );

	startTrackingSelection = ( index ) => {
		if ( ! this.isEditable() ) {
			return;
		}

		this.pendingEdit = index;
		document.addEventListener( 'mouseup', this.editDone, true );
	};

	editDone = ( event ) => {
		if ( ! this.isEditable() ) {
			return;
		}

		document.removeEventListener( 'mouseup', this.editDone, true );
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

			if ( child === extentNode ) {
				length += extentOffset;
			} else if ( undefined !== length ) {
				length += child.textContent.length;
			}

			if ( length && child === baseNode ) {
				length -= baseOffset;
			}

			if ( undefined !== length ) {
				break;
			}

			start += child.textContent.length;
		}

		this.setState( {
			editing,
			editOffset: [ start, start + length ]
		} );
	};

	deleteDone = ( index ) => {
		if ( confirm( translate( 'Are you sure you want to delete this done?' ) ) ) {
			this.props.deleteDone( this.props.date, index );
		}
	};

	isEditable() {
		return this.props.userId === USER_ID;
	}

	render() {
		const { date, dones } = this.props;
		const { editing } = this.state;
		const classes = classNames( 'dones-list', {
			'is-editable': this.isEditable()
		} );

		return (
			<ul className={ classes }>
				<QueryDones date={ date } />
				{ map( dones, ( done, index ) => (
					<li
						key={ index }
						className="dones-list__item">
						{ index === editing
							? (
								<DoneInput
									initialText={ done.text }
									initialDone={ done.done }
									selectionOffset={ this.state.editOffset }
									date={ date }
									index={ index }
									onCancel={ this.stopEditing }
									onSubmit={ this.stopEditing } />
							)
							: [
								<DoneStatus
									done={ done.done }
									onToggle={
										this.isEditable()
											? partial( this.props.toggleDone, date, index )
											: null
									} />,
								<DonesListItemText
									onMouseDown={ partial( this.startTrackingSelection, index ) }
									onClick={ this.editDone }>
									{ done.text }
								</DonesListItemText>,
								<button
									type="button"
									onClick={ partial( this.deleteDone, index ) }
									className="dones-list__trash">
									<Icon icon="trash" size={ 18 } />
								</button>
							] }
					</li>
				) ) }
				{ ! dones && <li className="dones-list__item is-placeholder" /> }
				{ dones && ! dones.length && (
					<em>{ translate( 'Nothing reported yet!' ) }</em>
				) }
			</ul>
		);
	}
}

export default connect(
	( state, ownProps ) => ( {
		dones: getUserDones( state, ownProps.userId, ownProps.date )
	} ),
	{ toggleDone, deleteDone }
)( DonesList );
