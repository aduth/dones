/**
 * External dependencies
 */
import { createElement } from 'preact';
import connect from 'components/connect';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import { translate } from 'lib/i18n';
import { getDonesTotalPages } from 'state/selectors';

function TagPagination( { tag, page, totalPages } ) {
	return (
		<nav className="tag-pagination">
			<Button
				disabled={ page <= 1 }
				to={ `/tags/${ tag }/page/${ page - 1 }/` }
				preload
			>
				{ translate( 'Previous' ) }
			</Button>
			<Button
				disabled={ page >= totalPages }
				to={ `/tags/${ tag }/page/${ page + 1 }/` }
				preload
			>
				{ translate( 'Next' ) }
			</Button>
		</nav>
	);
}

export default connect( ( state, { tag } ) => ( {
	totalPages: getDonesTotalPages( state, { tag } ),
} ) )( TagPagination );
