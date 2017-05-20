/**
 * External dependencies
 */
import { createElement, Component } from 'preact';
import { connect } from 'preact-redux';
import classNames from 'classnames';
import { startsWith, omit, assign, uniq, compact } from 'lodash';

/**
 * Internal dependencies
 */
import { SITE_URL } from 'constant';
import { pushRoute } from 'state/routing/actions';

class Link extends Component {
	static defaultProps = {
		onClick: () => {},
		to: ''
	};

	isManagedPath() {
		return '/' === this.props.to[ 0 ];
	}

	isLocalPath() {
		const { to } = this.props;
		return this.isManagedPath() || startsWith( to, location.origin + '/' );
	}

	onClick = ( event ) => {
		if ( ! this.isManagedPath() ) {
			return;
		}

		event.preventDefault();
		this.props.pushRoute( this.props.to );
		this.props.onClick();
	};

	render() {
		const { to, className } = this.props;
		const props = omit( this.props, 'to', 'pushRoute' );
		const classes = classNames( 'link', className );

		if ( ! this.isLocalPath() ) {
			assign( props, {
				target: '_blank',
				rel: uniq( compact( [
					props.rel,
					'noopener',
					'noreferrer'
				] ) ).join( ' ' )
			} );
		}

		// Prefix with site URL if root-relative path
		let href = to;
		if ( this.isManagedPath() ) {
			href = SITE_URL + href;
		}

		return (
			<a
				{ ...props }
				className={ classes }
				href={ href }
				onClick={ this.onClick } />
		);
	}
}

export default connect( null, { pushRoute } )( Link );
