/**
 * External dependencies
 */
import { useState, useEffect } from 'preact/hooks';
import classNames from 'classcat';
import { map } from 'lodash';

/**
 * Internal dependencies
 */
import Popover from 'components/popover';

function PopoverMenu( {
	onSelect = () => {},
	items = [],
	selectKeyCode = 13,
	position,
	style,
} ) {
	const [ selectedIndex, setSelectedIndex ] = useState( 0 );

	useEffect( () => {
		window.addEventListener( 'keydown', maybeIncrementIndex );

		return () =>
			window.removeEventListener( 'keydown', maybeIncrementIndex );
	} );

	useEffect( () => {
		setSelectedIndex(
			Math.max( Math.min( items.length - 1, selectedIndex ), 0 )
		);
	}, [ items.length ] );

	function maybeIncrementIndex( event ) {
		let nextSelectedIndex = selectedIndex;
		switch ( event.keyCode ) {
			// Arrow Down
			case 40:
				nextSelectedIndex++;
				break;

			// Arrow Up
			case 38:
				nextSelectedIndex--;
				break;

			// Enter / Custom Select
			case selectKeyCode:
				onSelect( items[ nextSelectedIndex ] );
				break;

			default:
				return;
		}

		event.preventDefault();

		setSelectedIndex(
			Math.max( Math.min( items.length - 1, nextSelectedIndex ), 0 )
		);
	}

	return (
		<Popover
			isVisible
			position={ position }
			style={ style }
			className="popover-menu"
		>
			<ul className="popover-menu__list">
				{ map( items, ( child, i ) => {
					const isSelected = selectedIndex === i;
					const itemClasses = classNames( [
						'popover-menu__list-item',
						{
							'is-selected': isSelected,
						},
					] );

					return (
						<li key={ i } className={ itemClasses }>
							<button
								onMouseDown={ () => onSelect( child ) }
								className="popover-menu__button"
							>
								{ child }
							</button>
						</li>
					);
				} ) }
			</ul>
		</Popover>
	);
}

export default PopoverMenu;
