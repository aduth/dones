/**
 * External dependencies
 */
import { createElement } from 'preact';
import { useSelector } from 'prsh';

/**
 * Internal dependencies
 */
import { getMatchedRoute } from 'state/selectors';

function Root() {
	const { Route } = useSelector( getMatchedRoute );

	return <Route />;
}

export default Root;
