/**
 * External dependencies
 */
import { createElement, render } from 'preact';
import { Provider } from 'preact-redux';

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
import { SITE_URL, API_NONCE, PRELOADED_REQUESTS } from 'constant';
import 'assets/stylesheets/main.scss';

/**
 * Redux store instance
 *
 * @type {Redux.Store}
 */
const store = createReduxStore();

// Initialize requests state
store.dispatch( setRequestNonce( API_NONCE ) );
store.dispatch( setPreloadedResponses( PRELOADED_REQUESTS ) );

// Initialize routing state
const path = window.location.href.substr( SITE_URL.length );
store.dispatch( replaceRoute( path ) );

// Render
const target = document.getElementById( 'app' );
render(
	<Provider store={ store }>
		<Root />
	</Provider>,
	target,
	target.children[ 0 ]
);
