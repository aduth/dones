/**
 * External dependencies
 */
import { useSelector } from 'prsh';

/**
 * Internal dependencies
 */
import Button from 'components/button';
import { translate } from 'lib/i18n';
import { getDonesTotalPages } from 'state/selectors';

function TagPagination( { tag, page } ) {
	const totalPages = useSelector( ( state ) =>
		getDonesTotalPages( state, { tag } )
	);

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

export default TagPagination;
