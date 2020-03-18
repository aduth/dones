/**
 * External dependencies
 */
import { createElement, Component } from 'preact';
import connect from 'components/connect';
import classNames from 'classcat';
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
		onMouseLeave: () => {},
		to: '',
	};

	constructor() {
		super( ...arguments );

		this.state = {
			isMouseOver: false,
		};
	}

	componentWillReceiveProps( nextProps ) {
		const { to, preload, onPreload } = nextProps;
		const { isMouseOver } = this.state;

		if ( this.props.to !== to && preload && onPreload && isMouseOver ) {
			onPreload( to );
		}
	}

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

		// Set mouseover as state so we can track prop changes and re-trigger
		// preload if the link changes while mouse within
		this.setState( { isMouseOver: true } );
	};

	onMouseLeave = ( event ) => {
		const { onMouseLeave } = this.props;
		const { isMouseOver } = this.state;

		// Preserve original handler of rendering parent
		onMouseLeave( event );

		if ( isMouseOver ) {
			this.setState( { isMouseOver: false } );
		}
	};

	render() {
		const { to, className } = this.props;
		const props = omit( this.props, 'to', 'pushRoute', 'preload' );
		const classes = classNames( [ 'link', className ] );

		if ( ! this.isLocalPath() ) {
			assign( props, {
				target: '_blank',
				rel: uniq( compact( [
					props.rel,
					'noopener',
					'noreferrer',
				] ) ).join( ' ' ),
			} );
		}

		// Prefix with site URL if root-relative path
		let href = to;
		if ( this.isManagedPath() ) {
			href = SITE_URL + href;
		}

		// ESLint disable reason: The content is provided via spread children
		// prop.

		return (
			// eslint-disable-next-line jsx-a11y/anchor-has-content
			<a
				{ ...props }
				className={ classes }
				href={ href }
				onClick={ this.onClick }
				onMouseEnter={ this.onMouseEnter }
				onMouseLeave={ this.onMouseLeave } />
		);
	}
}

export default connect(
	null,
	{
		onNavigate: pushRoute,
		onPreload: preloadRoute,
	}
)( Link );
