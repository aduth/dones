/**
 * External dependencies
 */
import { useState, useRef, useEffect } from 'preact/hooks';

/**
 * Internal dependencies
 */
import Popover from 'components/popover';

function Tooltip( { position, children } ) {
	const [ isVisible, setIsVisible ] = useState( false );
	const node = useRef();

	useEffect( () => {
		const showTooltip = () => setIsVisible( true );
		const hideTooltip = () => setIsVisible( false );

		const { parentNode } = node.current;
		parentNode.addEventListener( 'mouseenter', showTooltip );
		parentNode.addEventListener( 'focusin', showTooltip );
		parentNode.addEventListener( 'mouseleave', hideTooltip );
		parentNode.addEventListener( 'focusout', hideTooltip );

		return () => {
			parentNode.removeEventListener( 'mouseenter', showTooltip );
			parentNode.removeEventListener( 'focusin', showTooltip );
			parentNode.removeEventListener( 'mouseleave', hideTooltip );
			parentNode.removeEventListener( 'focusout', hideTooltip );
		};
	}, [] );

	return (
		<span ref={ node } className="tooltip">
			{ isVisible && (
				<Popover position={ position }>{ children }</Popover>
			) }
		</span>
	);
}

export default Tooltip;
