/**
 * External dependencies
 */
import { createElement, render as _render } from 'preact';
import { Provider } from 'react-redux';

/**
 * Internal dependencies
 */
import createReduxStore from 'state';

export function render( element ) {
	document.body.innerHTML = '';

	const wrapper = document.createElement( 'div' );
	document.body.appendChild( wrapper );

	_render( (
		<Provider store={ createReduxStore() }>
			{ element }
		</Provider>
	), wrapper );

	return wrapper.firstChild;
}
