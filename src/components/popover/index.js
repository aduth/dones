/**
 * External dependencies
 */
import { h } from 'preact';
import classNames from 'classnames';
import { map } from 'lodash';

export default function Popover( { position, style, children } ) {
	// Normalize position to include both y and x offsets
	const [ y, x = 'center' ] = position.split( '-' );
	const subPositions = [ y, x ];

	// Generate className
	const positionClasses = map( subPositions, ( subPosition ) => `is-${ subPosition }` );
	const classes = classNames( 'popover', positionClasses );

	return (
		<div style={ style } className={ classes }>
			{ children }
		</div>
	);
}

Popover.defaultProps = {
	position: 'top'
};
