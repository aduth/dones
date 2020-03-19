/**
 * External dependencies
 */
import { Component } from 'preact';
import connect from 'components/connect';
import { date as phpdate } from 'phpdate';

/**
 * Internal dependencies
 */
import { replaceRoute } from 'state/routing/actions';
import { toSiteTime } from 'lib/i18n';

class HomeRoute extends Component {
	componentWillMount() {
		const date = phpdate( 'Y-m-d', toSiteTime() );
		this.props.replaceRoute( `/date/${ date }/` );
	}

	render() {
		return null;
	}
}

export default connect( null, {
	replaceRoute,
} )( HomeRoute );
