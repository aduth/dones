/**
 * External dependencies
 */
import { createElement } from 'preact';
import { connect } from 'preact-redux';

/**
 * Internal dependencies
 */
import Page from 'components/page';
import Card from 'components/card';
import DonesList from 'components/dones-list';
import { getRouteParam } from 'state/selectors';
import { translate } from 'lib/i18n';

function TagRoute( { tag } ) {
	return (
		<Page title={ translate( 'Tags' ) }>
			<Card>
				<DonesList query={ { tag } } />
			</Card>
		</Page>
	);
}

export default connect( ( state ) => ( {
	tag: getRouteParam( state, 'tag' )
} ) )( TagRoute );
