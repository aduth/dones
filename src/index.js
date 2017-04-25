/**
 * External dependencies
 */
import { createElement, render } from 'preact';

/**
 * Internal dependencies
 */
import Root from 'components/root';
import createReduxStore from 'state';
import { replaceRoute } from 'state/routing/actions';
import 'assets/stylesheets/main.scss';

/**
 * Redux store instance
 *
 * @type {Redux.Store}
 */
const store = createReduxStore();

/**
 * Initialize routing state
 */

const { pathname, search } = window.location;
store.dispatch( replaceRoute( pathname + search ) );

/**
 * Render
 */

render(
	<Root store={ store } />,
	document.getElementById( 'app' )
);
