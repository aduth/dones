/**
 * External dependencies
 */
import { createElement } from 'preact';
import { connect } from 'react-redux';

/**
 * Internal dependencies
 */
import { getMatchedRoute } from 'state/selectors';

function Root( { Route } ) {
	return <Route />;
}

export default connect( ( state ) => ( {
	Route: getMatchedRoute( state ).Route,
} ) )( Root );
