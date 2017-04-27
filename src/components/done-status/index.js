/**
 * External dependencies
 */
import { createElement } from 'preact';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Tooltip from 'components/tooltip';
import Icon from 'components/icon';
import { translate } from 'lib/i18n';

export default function DoneStatus() {
	const { done, onToggle, disabled } = this.props;
	const isToggleable = onToggle && ! disabled;
	const classes = classNames( 'done-status', {
		'is-done': done,
		'is-toggleable': isToggleable
	} );

	const text = done
		? translate( 'Done' )
		: translate( 'Goal' );

	let onClick;
	if ( isToggleable ) {
		onClick = () => onToggle( ! done );
	}

	return (
		<button
			type="button"
			onClick={ onClick }
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
