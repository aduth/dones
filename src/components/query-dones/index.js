/**
 * External dependencies
 */
import { Component } from 'preact';
import { connect } from 'preact-redux';

/**
 * Internal dependencies
 */
import { requestDones } from 'state/dones/actions';

class QueryDones extends Component {
	componentDidMount() {
		this.props.requestDones( this.props.date );
	}

	componentDidUpdate( prevProps ) {
		if ( this.props.date === prevProps.date ) {
			return;
		}

		this.props.requestDones( this.props.date );
	}

	render() {
		return null;
	}
}

export default connect( null, { requestDones } )( QueryDones );
