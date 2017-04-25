/**
 * External dependencies
 */
import { createElement, Component } from 'preact';

/**
 * Internal dependencies
 */
import Popover from 'components/popover';

export default class Tooltip extends Component {
	componentDidMount() {
		this.element.parentNode.addEventListener( 'mouseenter', this.showTooltip );
		this.element.parentNode.addEventListener( 'mouseleave', this.hideTooltip );
	}

	componentWillUnmount() {
		this.element.parentNode.removeEventListener( 'mouseenter', this.showTooltip );
		this.element.parentNode.removeEventListener( 'mouseleave', this.hideTooltip );
	}

	showTooltip = () => this.setState( { isVisible: true } );

	hideTooltip = () => this.setState( { isVisible: false } );

	setRef = ( element ) => this.element = element;

	render() {
		const { position, children } = this.props;
		const { isVisible } = this.state;

		return (
			<span ref={ this.setRef }>
				{ isVisible && (
					<Popover position={ position }>
						{ children }
					</Popover>
				) }
			</span>
		);
	}
}
