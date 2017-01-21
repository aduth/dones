/**
 * External dependencies
 */
import { h, Component } from 'preact';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Tooltip from 'components/tooltip';
import Icon from 'components/icon';
import { translate } from 'lib/i18n';

export default class DoneStatus extends Component {
	onToggle = () => {
		const { onToggle } = this.props;
		if ( onToggle ) {
			onToggle( ! this.props.done );
		}
	}

	render() {
		const { done, onToggle } = this.props;
		const classes = classNames( 'done-status', {
			'is-done': done,
			'is-toggleable': onToggle
		} );

		const text = done
			? translate( 'Done' )
			: translate( 'Goal' );

		return (
			<button
				type="button"
				onClick={ this.onToggle }
				className={ classes }>
				<Icon
					icon="check"
					size={ 14 }>
					{ text }
				</Icon>
				<Tooltip>{ text }</Tooltip>
			</button>
		);
	}
}
