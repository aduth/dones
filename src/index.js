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
	setPreloadedResponses,
	clearPreloadedResponses
} from 'state/requests/actions';
import { replaceRoute } from 'state/routing/actions';
import { PRELOADED_REQUESTS } from 'constant';
import 'assets/stylesheets/main.scss';

/**
 * Redux store instance
 *
 * @type {Redux.Store}
 */
const store = createReduxStore();

// Initialize preload state
store.dispatch( setPreloadedResponses( PRELOADED_REQUESTS ) );

// Initialize routing state
const { pathname, search } = window.location;
store.dispatch( replaceRoute( pathname + search ) );

// Render
render(
	<Provider store={ store }>
		<Root />
	</Provider>,
	document.getElementById( 'app' )
);

// Preloaded responses are only valid for first render
setTimeout( () => store.dispatch( clearPreloadedResponses() ) );
