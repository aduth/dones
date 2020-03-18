/**
 * External dependencies
 */
import { createElement, render as _render } from 'preact';
import { StoreContext } from 'prsh';

/**
 * Internal dependencies
 */
import createReduxStore from 'state';

export function render( element ) {
	document.body.innerHTML = '';

	const wrapper = document.createElement( 'div' );
	document.body.appendChild( wrapper );

	_render(
		<StoreContext.Provider value={ createReduxStore() }>
			{ element }
		</StoreContext.Provider>,
		wrapper
	);

	return wrapper.firstChild;
}
