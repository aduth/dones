/**
 * External dependencies
 */
import { Component } from 'preact';
import connect from 'components/connect';
import { format as formatDate } from 'date-fns';

/**
 * Internal dependencies
 */
import { replaceRoute } from 'state/routing/actions';
import { toSiteTime } from 'lib/i18n';

class HomeRoute extends Component {
	componentWillMount() {
		const date = formatDate( toSiteTime( new Date() ), 'yyyy-MM-dd' );
		this.props.replaceRoute( `/date/${ date }/` );
	}

	render() {
		return null;
	}
}

export default connect( null, {
	replaceRoute,
} )( HomeRoute );
