/**
 * External dependencies
 */
import { Component } from 'preact';
import { connect } from 'preact-redux';
import shallowEqual from 'shallow-equal/objects';

/**
 * Internal dependencies
 */
import { requestDones } from 'state/dones/actions';

class QueryDones extends Component {
	componentDidMount() {
		this.props.requestDones( this.props.query );
	}

	componentDidUpdate( prevProps ) {
		if ( shallowEqual( this.props.query, prevProps.query ) ) {
			return;
		}

		this.props.requestDones( this.props.query );
	}

	render() {
		return null;
	}
}

export default connect( null, { requestDones } )( QueryDones );
