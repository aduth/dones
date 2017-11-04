/**
 * External dependencies
 */
import { createElement, Component } from 'preact';
import classNames from 'classcat';

export default class Popover extends Component {
	static defaultProps = {
		position: 'top',
	};

	constructor() {
		super( ...arguments );

		this.state = {
			forcedYAxis: null,
			forcedXAxis: null,
		};
	}

	componentDidMount() {
		this.setForcedPositions();
	}

	setForcedPositions() {
		const rect = this.node.getBoundingClientRect();

		// Check exceeding top or bottom of viewport
		if ( rect.top < 0 ) {
			this.setState( { forcedYAxis: 'bottom' } );
		} else if ( rect.bottom > window.innerHeight ) {
			this.setState( { forcedYAxis: 'top' } );
		}

		// Check exceeding left or right of viewport
		if ( rect.left < 0 ) {
			this.setState( { forcedXAxis: 'right' } );
		} else if ( rect.right > window.innerWidth ) {
			this.setState( { forcedXAxis: 'left' } );
		}
	}

	setNode = ( node ) => {
		this.node = node;
	};

	render() {
		const { position, style, children } = this.props;
		const { forcedYAxis, forcedXAxis } = this.state;

		// Normalize position to include both y and x offsets
		const [ yAxis = 'top', xAxis = 'center' ] = position.split( ' ' );

		// Generate className
		const classes = classNames( [
			'popover',
			`is-${ forcedYAxis || yAxis }`,
			`is-${ forcedXAxis || xAxis }`,
		] );

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
