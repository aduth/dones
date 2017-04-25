/**
 * External dependencies
 */
import { createElement } from 'preact';
import classNames from 'classnames';

/**
 * Internal dependencies
 */
import Link from 'components/link';
import Icon from 'components/icon';

export default function SidebarAction( { icon, to, selected, children } ) {
	const classes = classNames( 'sidebar__action', {
		'is-selected': selected
	} );

	return (
		<Link to={ to } className={ classes }>
			<Icon icon={ icon } size={ 26 } />
			<div className="sidebar__action-text">
				{ children }
			</div>
		</Link>
	);
}
