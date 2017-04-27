/**
 * External dependencies
 */
import { createElement, render } from 'preact';

/**
 * Internal dependencies
 */
import Root from 'components/root';
import createReduxStore from 'state';
import { clearPreloadedResponses } from 'state/requests/actions';
import { replaceRoute } from 'state/routing/actions';
import 'assets/stylesheets/main.scss';

/**
 * Redux store instance
 *
 * @type {Redux.Store}
 */
const store = createReduxStore();

// Initialize routing state
const { pathname, search } = window.location;
store.dispatch( replaceRoute( pathname + search ) );

// Render
const app = <Root store={ store } />;
render( app, document.getElementById( 'app' ) );

// Preloaded responses are only valid for first render
store.dispatch( clearPreloadedResponses() );
