/**
 * External dependencies
 */
import { h, Component } from 'preact';
import classNames from 'classnames';
import { reduce, assign, map } from 'lodash';

/**
 * Internal dependencies
 */
import Portal from 'components/portal';

/**
 * Merges objects of style values, attempting to merge by adding values of
 * identical style properties.
 *
 * @param  {Object[]} styles Styles objects
 * @return {Object}          Merged style object
 */
function mergeStyles( ...styles ) {
	return reduce( styles, ( merged, style ) => {
		return reduce( style, ( memo, value, key ) => {
			if ( Number.isFinite( value ) ) {
				memo[ key ] = ( memo[ key ] || 0 ) + value;
			} else {
				memo[ key ] = value;
			}

			return memo;
		}, merged );
	}, {} );
}

export default class Popover extends Component {
	static defaultProps = {
		position: 'top',
		style: {}
	};

	componentDidMount() {
		this.bindWindowEvents( this.props.isVisible );
	}

	componentDidUpdate() {
		this.bindWindowEvents( this.props.isVisible );
	}

	componentWillUnmount() {
		this.bindWindowEvents( false );
	}

	bindWindowEvents( listen ) {
		const bindFn = `${ listen ? 'add' : 'remove' }EventListener`;
		window[ bindFn ]( 'resize', this.recalculatePosition );
		window[ bindFn ]( 'scroll', this.recalculatePosition );
	}

	recalculatePosition = () => window.requestAnimationFrame( () => this.forceUpdate() );

	render() {
		const { target, isVisible, position, style, children } = this.props;
		if ( ! isVisible || ! target ) {
			// Bug: Preact doesn't fire `componentWillUnmount` on Portal if Popover
			// replaces Portal with `null` by transitioning visible to non-visible
			return <noscript />;
		}

		const [ y, x = 'center' ] = position.split( '-' );
		const subPositions = [ y, x ];
		const positionClasses = map( subPositions, ( subPosition ) => `is-${ subPosition }` );
		const classes = classNames( 'popover', positionClasses );

		const bounds = target.getBoundingClientRect();
		const styles = reduce( subPositions, ( memo, subPosition ) => {
			switch ( subPosition ) {
				case 'top':
					return assign( memo, { top: bounds.top } );

				case 'bottom':
					return assign( memo, { top: bounds.bottom } );

				case 'left':
					return assign( memo, { left: bounds.left } );

				case 'center':
					return assign( memo, { left: bounds.left + ( bounds.width / 2 ) } );

				case 'right':
					return assign( memo, { left: bounds.right } );
			}

			return memo;
		}, {} );

		return (
			<Portal style={ mergeStyles( styles, style ) } className={ classes }>
				{ children }
			</Portal>
		);
	}
}
