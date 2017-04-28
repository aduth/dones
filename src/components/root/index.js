/**
 * External dependencies
 */
import { createElement } from 'preact';
import { connect } from 'preact-redux';

/**
 * Internal dependencies
 */
import { getMatchedRoute } from 'state/selectors';

function Root( { Route } ) {
	return <Route />;
}

export default connect( ( state ) => ( {
	Route: getMatchedRoute( state ).Route
} ) )( Root );
