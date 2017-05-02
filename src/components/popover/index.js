/**
 * External dependencies
 */
import { createElement, Component } from 'preact';
import classNames from 'classnames';
import { isEqual, map } from 'lodash';

export default class Popover extends Component {
	static defaultProps = {
		position: 'top'
	};

	constructor() {
		super( ...arguments );

		this.state = {
			forcedPositions: []
		};
	}

	componentDidMount() {
		this.setForcedPositions();
	}

	setForcedPositions() {
		const rect = this.node.getBoundingClientRect();
		const { forcedPositions } = this.state;

		const nextForcedPositions = [];
		if ( rect.top < 0 ) {
			nextForcedPositions[ 0 ] = 'bottom';
		} else if ( rect.bottom > document.body.clientHeight ) {
			nextForcedPositions[ 0 ] = 'top';
		}

		if ( rect.left < 0 ) {
			nextForcedPositions[ 1 ] = 'right';
		} else if ( rect.right > document.body.clientWidth ) {
			nextForcedPositions[ 1 ] = 'left';
		}

		if ( ! isEqual( nextForcedPositions, forcedPositions ) ) {
			this.setState( {
				forcedPositions: nextForcedPositions
			} );
		}
	}

	setNode = ( node ) => {
		this.node = node;
	};

	render() {
		const { position, style, children } = this.props;
		const { forcedPositions } = this.state;

		// Normalize position to include both y and x offsets
		const [ y, x = 'center' ] = position.split( '-' );
		const subPositions = [ y, x ];

		// Apply forced positions in the case that the originally rendered
		// popover exceeds page bounds
		if ( forcedPositions.length ) {
			// Here we use Object.assign instead of Lodash's assign because
			// forcedPosition is a sparse array and we need spec compliancy
			Object.assign( subPositions, forcedPositions );
		}

		// Generate className
		const positionClasses = map( subPositions, ( subPosition ) => `is-${ subPosition }` );
		const classes = classNames( 'popover', positionClasses );

		return (
			<div
				ref={ this.setNode }
				style={ style }
				className={ classes }>
				{ children }
			</div>
		);
	}
}
