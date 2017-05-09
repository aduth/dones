/**
 * External dependencies
 */
import { createElement } from 'preact';
import classNames from 'classnames';
import { reduce } from 'lodash';

/**
 * Internal dependencies
 */
import Link from 'components/link';

function toggleOutlineActive( active ) {
	return ( { currentTarget } ) => {
		currentTarget.style.outline = active ? '' : '0';
	};
}

export default function Button( props ) {
	const { type, to, disabled, className, children } = props;
	const isLink = to && ! disabled;

	return createElement( isLink ? Link : 'button', {
		...props,
		to: isLink ? to : null,
		type: isLink ? null : type,
		onMouseDown: toggleOutlineActive( false ),
		onBlur: toggleOutlineActive( true ),
		className: classNames( 'button', className, reduce( [
			'primary',
			'unstyled'
		], ( memo, modifier ) => {
			memo[ `is-${ modifier }` ] = props[ modifier ];
			return memo;
		}, {} ) )
	}, children );
}

Button.defaultProps = {
	type: 'button'
};
