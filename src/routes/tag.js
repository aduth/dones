/**
 * External dependencies
 */
import { createElement } from 'preact';
import { connect } from 'preact-redux';

/**
 * Internal dependencies
 */
import Page from 'components/page';
import DonesList from 'components/dones-list';
import { getRouteParam } from 'state/selectors';

function TagRoute( { tag } ) {
	return (
		<Page title="Tags">
			<DonesList query={ { tag } } />
		</Page>
	);
}

export default connect( ( state ) => ( {
	tag: getRouteParam( state, 'tag' )
} ) )( TagRoute );
