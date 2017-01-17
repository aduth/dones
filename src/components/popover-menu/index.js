/**
 * External dependencies
 */
import { h, Component } from 'preact';
import classNames from 'classnames';
import { map } from 'lodash';

/**
 * Internal dependencies
 */
import Popover from 'components/popover';

export default class PopoverMenu extends Component {
	static defaultProps = {
		onSelect: () => {},
		items: [],
		selectKeyCode: 13
	};

	state = {
		selectedIndex: 0
	};

	componentDidMount() {
		this.toggleEventListeners( this.isVisible() );
	}

	componentDidUpdate() {
		this.toggleEventListeners( this.isVisible() );
	}

	componentWillUnmount() {
		this.toggleEventListeners( false );
	}

	toggleEventListeners( listen ) {
		const bindFn = `${ listen ? 'add' : 'remove' }EventListener`;
		window[ bindFn ]( 'keydown', this.maybeIncrementIndex );
	}

	isVisible() {
		if ( 'isVisible' in this.props ) {
			return this.props.isVisible;
		}

		return this.props.items.length > 0;
	}

	maybeIncrementIndex = ( event ) => {
		const { items, selectKeyCode, onSelect } = this.props;
		if ( ! items.length ) {
			return;
		}

		let { selectedIndex } = this.state;
		switch ( event.keyCode ) {
			// Arrow Down
			case 40:
				selectedIndex++;
				break;

			// Arrow Up
			case 38:
				selectedIndex--;
				break;

			// Enter / Custom Select
			case selectKeyCode:
				onSelect( items[ selectedIndex ] );
				break;

			default:
				return;
		}

		event.preventDefault();

		if ( selectedIndex >= 0 && selectedIndex < items.length ) {
			this.setState( { selectedIndex } );
		}
	};

	render() {
		const { position, target, items, style } = this.props;
		const { selectedIndex } = this.state;

		return (
			<Popover
				isVisible={ this.isVisible() }
				position={ position }
				target={ target }
				style={ style }
				className="popover-menu">
				<ul className="popover-menu__list">
					{ map( items, ( child, i ) => {
						const isSelected = ( selectedIndex === i );
						const itemClasses = classNames( 'popover-menu__list-item', {
							'is-selected': isSelected
						} );

						return (
							<li key={ i } className={ itemClasses }>
								{ child }
							</li>
						);
					} ) }
				</ul>
			</Popover>
		);
	}
}
