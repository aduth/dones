/**
 * External dependencies
 */
import { render as _render } from 'preact';
import { act } from 'preact/test-utils';
import { StoreContext } from 'prsh';

/**
 * Internal dependencies
 */
import createReduxStore from 'state';

export function render( element, store = createReduxStore() ) {
	document.body.innerHTML = '';

	const wrapper = document.createElement( 'div' );
	document.body.appendChild( wrapper );

	act( () => {
		_render(
			<StoreContext.Provider value={ store }>
				{ element }
			</StoreContext.Provider>,
			wrapper
		);
	} );

	return wrapper.firstChild;
}
