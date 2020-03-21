/**
 * External dependencies
 */
import { useEffect } from 'preact/hooks';
import { useSelector } from 'prsh';

/**
 * Internal dependencies
 */
import { translate } from 'lib/i18n';
import { isMutativeRequestInFlight } from 'state/selectors';

function MutativeRequestPrompt() {
	const isRequestInFlight = useSelector( isMutativeRequestInFlight );

	useEffect( () => {
		function maybePrompt( event ) {
			const message = translate( 'Changes you made may not be saved.' );
			event.returnValue = message;
			return message;
		}

		if ( isRequestInFlight ) {
			window.addEventListener( 'beforeunload', maybePrompt );
		}

		return () => window.removeEventListener( 'beforeunload', maybePrompt );
	}, [ isRequestInFlight ] );

	return null;
}

export default MutativeRequestPrompt;
