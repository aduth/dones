/**
 * External dependencies
 */
import { createElement } from 'preact';
import { connect } from 'preact-redux';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import Page from 'components/page';
import TagDones from 'components/tag-dones';
import { getRouteParam } from 'state/selectors';
import { translate } from 'lib/i18n';

function TagRoute( { tag } ) {
	return (
		<Page title={ translate( 'Tags' ) }>
			<Card title={
				translate( 'Tag: %s' )
					.replace( '%s', '#' + tag )
			} />
			<TagDones tag={ tag } />
		</Page>
	);
}

export default connect( ( state ) => ( {
	tag: getRouteParam( state, 'tag' )
} ) )( TagRoute );
