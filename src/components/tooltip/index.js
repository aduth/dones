/**
 * External dependencies
 */
import { Component } from 'preact';

/**
 * Internal dependencies
 */
import Popover from 'components/popover';

export default class Tooltip extends Component {
	componentDidMount() {
		this.toggleEventBinding( true );
	}

	componentWillUnmount() {
		this.toggleEventBinding( false );
	}

	toggleEventBinding( toggle ) {
		const bindFn = toggle ? 'addEventListener' : 'removeEventListener';
		const { parentNode } = this.node;
		parentNode[ bindFn ]( 'mouseenter', this.showTooltip );
		parentNode[ bindFn ]( 'focusin', this.showTooltip );
		parentNode[ bindFn ]( 'mouseleave', this.hideTooltip );
		parentNode[ bindFn ]( 'focusout', this.hideTooltip );
	}

	showTooltip = () => this.setState( { isVisible: true } );

	hideTooltip = () => this.setState( { isVisible: false } );

	setRef = ( node ) => ( this.node = node );

	render() {
		const { position, children } = this.props;
		const { isVisible } = this.state;

		return (
			<span ref={ this.setRef } className="tooltip">
				{ isVisible && (
					<Popover position={ position }>{ children }</Popover>
				) }
			</span>
		);
	}
}
