/**
 * External dependencies
 */
import { createElement, Component } from 'preact';
import classNames from 'classcat';
import { size, map } from 'lodash';

/**
 * Internal dependencies
 */
import Popover from 'components/popover';

export default class PopoverMenu extends Component {
	static defaultProps = {
		onSelect: () => {},
		items: [],
		selectKeyCode: 13,
	};

	state = {
		selectedIndex: 0,
	};

	componentDidMount() {
		this.toggleEventListeners( this.isVisible() );
	}

	componentWillReceiveProps( nextProps ) {
		const nextItemsSize = size( nextProps.items );
		const { selectedIndex } = this.state;

		// Set selected index to last item when items set shrinks within
		if ( selectedIndex >= nextItemsSize ) {
			const nextSelectedIndex = Math.max( nextItemsSize - 1, 0 );
			this.setState( { selectedIndex: nextSelectedIndex } );
		}
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
		const { position, items, style, onSelect } = this.props;
		const { selectedIndex } = this.state;

		if ( 0 === size( items ) ) {
			return null;
		}

		return (
			<Popover
				isVisible={ this.isVisible() }
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
}
