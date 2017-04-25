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

export default function Button( props ) {
	const { type, to, className, children } = props;

	return createElement( to ? Link : 'button', {
		...props,
		to,
		type: to ? null : type,
		className: classNames( 'button', className, reduce( [
			'primary'
		], ( memo, modifier ) => {
			memo[ `is-${ modifier }` ] = props[ modifier ];
			return memo;
		}, {} ) )
	}, children );
}

Button.defaultProps = {
	type: 'button'
};
