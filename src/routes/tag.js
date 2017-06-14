/**
 * External dependencies
 */
import { createElement } from 'preact';
import { connect } from 'preact-redux';
import { defaultTo, toNumber } from 'lodash';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import Page from 'components/page';
import { requestUsers } from 'state/users/actions';
import { requestDones } from 'state/dones/actions';
import TagDones from 'components/tag-dones';
import TagPagination from 'components/tag-pagination';
import { getRouteParam } from 'state/selectors';
import { translate } from 'lib/i18n';

function TagRoute( { tag, page = 1 } ) {
	return (
		<Page title={ translate( 'Tags' ) }>
			<Card title={
				translate( 'Tag: %s' )
					.replace( '%s', '#' + tag )
			} />
			<TagDones query={ { tag, page } } />
			<TagPagination page={ page } tag={ tag } />
		</Page>
	);
}

TagRoute.prepareRoute = ( { params } ) => [
	requestUsers(),
	requestDones( {
		tag: params.tag,
		page: params.page || 1
	} )
];

export default connect( ( state ) => ( {
	tag: getRouteParam( state, 'tag' ),
	page: toNumber( defaultTo( getRouteParam( state, 'page' ), 1 ) )
} ) )( TagRoute );
