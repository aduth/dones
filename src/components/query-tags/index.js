/**
 * External dependencies
 */
import { Component } from 'preact';
import { connect } from 'preact-redux';

/**
 * Internal dependencies
 */
import { requestTags } from 'state/tags/actions';

class QueryTags extends Component {
	componentDidMount() {
		this.props.requestTags( this.props.date );
	}

	render() {
		return null;
	}
}

export default connect( null, { requestTags } )( QueryTags );
