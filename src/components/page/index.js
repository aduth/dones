/**
 * External dependencies
 */
import { useEffect } from 'preact/hooks';
import { useStore } from 'prsh';

/**
 * Internal dependencies
 */
import { setDocumentHeadTitle } from 'state/document-head/actions';
import DocumentHead from 'components/document-head';
import Sidebar from 'components/sidebar';
import Notices from 'components/notices';
import MutativeRequestPrompt from 'components/mutative-request-prompt';

function Page( { title, children } ) {
	const { dispatch } = useStore();

	useEffect( () => {
		dispatch( setDocumentHeadTitle( title ) );
	}, [ title ] );

	return (
		<main className="page">
			<DocumentHead />
			<Notices />
			<MutativeRequestPrompt />
			<Sidebar />
			<div className="page__content">{ children }</div>
		</main>
	);
}

export default Page;
