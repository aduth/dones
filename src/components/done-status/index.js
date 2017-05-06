/**
 * External dependencies
 */
import { createElement } from 'preact';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Button from 'components/button';
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

	// Avoid assigning `disabled` prop because the Tooltip's onMouseOver
	// behavior won't be triggered while disabled. Substitute instead with
	// combination of className, onClick, and aria-disabled.
	let onClick;
	if ( isToggleable ) {
		onClick = () => onToggle( ! done );
	}

	return (
		<Button
			onClick={ onClick }
			aria-disabled={ ! isToggleable }
			aria-pressed={ isToggleable ? done : null }
			className={ classes }
			unstyled>
			<Icon
				icon="check"
				size={ 14 }>
				{ text }
			</Icon>
			<Tooltip>{ text }</Tooltip>
		</Button>
	);
}
