/**
 * External dependencies
 */
import { h, Component } from 'preact';

/**
 * Internal dependencies
 */
import Popover from 'components/popover';

export default class Tooltip extends Component {
	componentDidMount() {
		this.target = this.element.parentNode;
		this.target.addEventListener( 'mouseenter', this.showTooltip );
		this.target.addEventListener( 'mouseleave', this.hideTooltip );
	}

	componentWillUnmount() {
		this.target.removeEventListener( 'mouseenter', this.showTooltip );
		this.target.removeEventListener( 'mouseleave', this.hideTooltip );
	}

	showTooltip = () => this.setState( { isVisible: true } );

	hideTooltip = () => this.setState( { isVisible: false } );

	setRef = ( element ) => this.element = element;

	render() {
		const { position, children } = this.props;
		const { isVisible } = this.state;

		return (
			<span ref={ this.setRef }>
				<Popover
					position={ position }
					isVisible={ isVisible }
					target={ this.target }>
					{ children }
				</Popover>
			</span>
		);
	}
}
