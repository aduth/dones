/**
 * External dependencies
 */
import { createElement } from 'preact';
import { Provider, connect } from 'preact-redux';

/**
 * Internal dependencies
 */
import { getMatchedRoute } from 'state/selectors';

function Root( { store, Route } ) {
	return (
		<Provider store={ store }>
			<Route />
		</Provider>
	);
}

export default connect( ( state ) => ( {
	Route: getMatchedRoute( state ).Route
} ) )( Root );
