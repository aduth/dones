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
import { preloadRoute, pushRoute } from 'state/routing/actions';

class Link extends Component {
	static defaultProps = {
		onClick: () => {},
		onMouseEnter: () => {},
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
		const { onNavigate, to, onClick } = this.props;
		if ( ! this.isManagedPath() ) {
			return;
		}

		event.preventDefault();
		onNavigate( to );
		onClick();
	};

	onMouseEnter = ( event ) => {
		const { onMouseEnter, preload, onPreload, to } = this.props;

		// Preserve original handler of rendering parent
		onMouseEnter( event );

		// If preload intent, trigger on mouse over
		if ( preload ) {
			onPreload( to );
		}
	};

	render() {
		const { to, className } = this.props;
		const props = omit( this.props, 'to', 'pushRoute', 'preload' );
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
				onClick={ this.onClick }
				onMouseEnter={ this.onMouseEnter } />
		);
	}
}

export default connect(
	null,
	{
		onNavigate: pushRoute,
		onPreload: preloadRoute
	}
)( Link );
