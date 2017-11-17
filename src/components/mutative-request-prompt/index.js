/**
 * External dependencies
 */
import { Component } from 'preact';
import { connect } from 'preact-redux';

/**
 * Internal dependencies
 */
import { translate } from 'lib/i18n';
import { isMutativeRequestInFlight } from 'state/selectors';

class MutativeRequestPrompt extends Component {
	componentDidMount() {
		window.addEventListener( 'beforeunload', this.maybePrompt );
	}

	componentWillUnmount() {
		window.removeEventListener( 'beforeunload', this.maybePrompt );
	}

	maybePrompt = ( event ) => {
		const { isRequestInFlight } = this.props;
		if ( ! isRequestInFlight ) {
			return;
		}

		const message = translate( 'Changes you made may not be saved.' );
		event.returnValue = message;
		return message;
	};

	render() {
		return null;
	}
}

export default connect( ( state ) => ( {
	isRequestInFlight: isMutativeRequestInFlight( state ),
} ) )( MutativeRequestPrompt );
