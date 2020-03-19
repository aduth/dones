/**
 * External dependencies
 */
import { createElement } from 'preact';
import classNames from 'classcat';
import { omit, reduce } from 'lodash';

/**
 * Internal dependencies
 */
import Link from 'components/link';

const STYLE_MODIFIERS = [ 'primary', 'unstyled', 'dangerous' ];

function Button( props ) {
	const {
		type = 'button',
		to,
		preload,
		disabled,
		className,
		children,
	} = props;

	function createToggleOutlineActive( isActive ) {
		return ( { currentTarget } ) => {
			currentTarget.style.outline = isActive ? '' : '0';
		};
	}

	const isLink = to && ! disabled;

	return createElement(
		isLink ? Link : 'button',
		{
			...omit( props, STYLE_MODIFIERS ),
			to: isLink ? to : null,
			type: isLink ? null : type,
			preload: isLink ? preload : null,
			onMouseDown: createToggleOutlineActive( false ),
			onBlur: createToggleOutlineActive( true ),
			className: classNames( [
				'button',
				className,
				reduce(
					STYLE_MODIFIERS,
					( memo, modifier ) => {
						memo[ `is-${ modifier }` ] = props[ modifier ];
						return memo;
					},
					{}
				),
			] ),
		},
		children
	);
}

export default Button;
