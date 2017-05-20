/**
 * External dependencies
 */
import { createElement, render as _render } from 'preact';
import { Provider } from 'preact-redux';

/**
 * Internal dependencies
 */
import createReduxStore from 'state';

export function render( element, parent, merge ) {
	return _render( (
		<Provider store={ createReduxStore() }>
			{ element }
		</Provider>
	), parent, merge );
}
