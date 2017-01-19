/**
 * External dependencies
 */
import { h, Component } from 'preact';
import { connect } from 'preact-redux';

/**
 * Internal dependencies
 */
import { setDocumentHeadTitle } from 'state/document-head/actions';
import DocumentHead from 'components/document-head';
import Sidebar from 'components/sidebar';

class Page extends Component {
	componentWillMount() {
		this.props.setTitle( this.props.title );
	}

	componentWillReceiveProps( nextProps ) {
		if ( nextProps.title !== this.props.title ) {
			nextProps.setTitle( nextProps.title );
		}
	}

	render() {
		const { children } = this.props;

		return (
			<main className="page">
				<DocumentHead />
				<Sidebar />
				<div className="page__content">
					{ children }
				</div>
			</main>
		);
	}
}

export default connect( null, {
	setTitle: setDocumentHeadTitle
} )( Page );
