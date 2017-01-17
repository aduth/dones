/**
 * External dependencies
 */
import { Component } from 'preact';
import { connect } from 'preact-redux';

/**
 * Internal dependencies
 */
import { requestUsers } from 'state/users/actions';

class QueryUsers extends Component {
	componentDidMount() {
		this.props.requestUsers();
	}

	render() {
		return null;
	}
}

export default connect( null, { requestUsers } )( QueryUsers );
