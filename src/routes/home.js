/**
 * External dependencies
 */
import { Component } from 'preact';
import { connect } from 'preact-redux';

/**
 * Internal dependencies
 */
import { replaceRoute } from 'state/routing/actions';
import { formatDate } from 'lib/i18n';

class HomeRoute extends Component {
	componentWillMount() {
		this.props.replaceRoute( `/date/${ formatDate( new Date(), 'YYYY-MM-DD' ) }/` );
	}

	render() {
		return null;
	}
}

export default connect( null, {
	replaceRoute
} )( HomeRoute );
