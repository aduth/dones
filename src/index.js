/**
 * External dependencies
 */
import { createElement, render } from 'preact';
import { Provider } from 'react-redux';
import wping from 'wping';

/**
 * Internal dependencies
 */
import Root from 'components/root';
import createReduxStore from 'state';
import {
	setRequestNonce,
	setPreloadedResponses,
} from 'state/requests/actions';
import { replaceRoute } from 'state/routing/actions';
import { SITE_URL, API_NONCE, API_ROOT, PRELOADED_REQUESTS } from 'constant';
import 'assets/stylesheets/main.scss';

/**
 * Redux store instance
 *
 * @type {import('redux').Store}
 */
const store = createReduxStore();

// Initialize requests state
store.dispatch( setRequestNonce( API_NONCE ) );
store.dispatch( setPreloadedResponses( PRELOADED_REQUESTS ) );
wping(
	( error, nextNonce ) => store.dispatch( setRequestNonce( nextNonce ) ),
	{ nonce: API_NONCE, apiRoot: API_ROOT }
);

// Initialize routing state
const path = window.location.href.substr( SITE_URL.length );
store.dispatch( replaceRoute( path ) );

// Render
const target = document.getElementById( 'app' );
render(
	<Provider store={ store }>
		<Root />
	</Provider>,
	target
);
