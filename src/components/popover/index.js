/**
 * External dependencies
 */
import { useRef, useState, useEffect } from 'preact/hooks';
import classNames from 'classcat';

function Popover( { position = 'top', style, children } ) {
	const node = useRef();
	const [ forcedYAxis, setForcedYAxis ] = useState( null );
	const [ forcedXAxis, setForcedXAxis ] = useState( null );

	useEffect( () => {
		const rect = node.current.getBoundingClientRect();

		// Check exceeding top or bottom of viewport
		if ( rect.top < 0 ) {
			setForcedYAxis( 'bottom' );
		} else if ( rect.bottom > window.innerHeight ) {
			setForcedYAxis( 'top' );
		}

		// Check exceeding left or right of viewport
		if ( rect.left < 0 ) {
			setForcedXAxis( 'right' );
		} else if ( rect.right > window.innerWidth ) {
			setForcedXAxis( 'left' );
		}
	}, [] );

	// Normalize position to include both y and x offsets
	const [ yAxis = 'top', xAxis = 'center' ] = position.split( ' ' );

	// Generate className
	const classes = classNames( [
		'popover',
		`is-${ forcedYAxis || yAxis }`,
		`is-${ forcedXAxis || xAxis }`,
	] );

	return (
		<div ref={ node } style={ style } className={ classes }>
			{ children }
		</div>
	);
}

export default Popover;
