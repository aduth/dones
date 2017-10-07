/**
 * External dependencies
 */
import { Component } from 'preact';
import { connect } from 'preact-redux';

/**
 * Internal dependencies
 */
import { getFormattedTitle } from 'state/selectors';

class DocumentHead extends Component {
	componentWillMount() {
		if ( 'undefined' === typeof document ) {
			return;
		}

		document.title = this.props.title;
	}

	componentWillReceiveProps( { title } ) {
		if ( 'undefined' === typeof document || title === document.title ) {
			return;
		}

		document.title = title;
	}

	render() {
		return null;
	}
}

export default connect( ( state ) => ( {
	title: getFormattedTitle( state ),
} ) )( DocumentHead );
