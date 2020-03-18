/**
 * External dependencies
 */
import { Component, createElement } from 'preact';
import classNames from 'classcat';
import { omit, reduce } from 'lodash';

/**
 * Internal dependencies
 */
import Link from 'components/link';

const STYLE_MODIFIERS = [ 'primary', 'unstyled', 'dangerous' ];

export default class Button extends Component {
	static defaultProps = {
		type: 'button',
	};

	toggleOutlineActive( isActive ) {
		return ( { currentTarget } ) => {
			currentTarget.style.outline = isActive ? '' : '0';
		};
	}

	onMouseDown = this.toggleOutlineActive( false );

	onBlur = this.toggleOutlineActive( true );

	render() {
		const { type, to, preload, disabled, className, children } = this.props;
		const isLink = to && ! disabled;

		return createElement(
			isLink ? Link : 'button',
			{
				...omit( this.props, STYLE_MODIFIERS ),
				to: isLink ? to : null,
				type: isLink ? null : type,
				preload: isLink ? preload : null,
				onMouseDown: this.onMouseDown,
				onBlur: this.onBlur,
				className: classNames( [
					'button',
					className,
					reduce(
						STYLE_MODIFIERS,
						( memo, modifier ) => {
							memo[ `is-${ modifier }` ] = this.props[ modifier ];
							return memo;
						},
						{}
					),
				] ),
			},
			children
		);
	}
}
