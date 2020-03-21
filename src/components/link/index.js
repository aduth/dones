/**
 * External dependencies
 */
import { useState, useEffect } from 'preact/hooks';
import classNames from 'classcat';
import { startsWith, assign, uniq, compact } from 'lodash';
import { useStore } from 'prsh';

/**
 * Internal dependencies
 */
import { SITE_URL } from 'constant';
import { preloadRoute, pushRoute } from 'state/routing/actions';

function Link( {
	onClick = () => {},
	onMouseEnter = () => {},
	onMouseLeave = () => {},
	to = '',
	className,
	preload,
	...additionalProps
} ) {
	const { dispatch } = useStore();
	const [ isMouseOver, setIsMouseOver ] = useState( false );

	useEffect( () => {
		if ( preload && isMouseOver ) {
			dispatch( preloadRoute( to ) );
		}
	}, [ to ] );

	function isManagedPath() {
		return '/' === to[ 0 ];
	}

	function isLocalPath() {
		return isManagedPath() || startsWith( to, location.origin + '/' );
	}

	function handleOnClick( event ) {
		if ( isManagedPath() ) {
			event.preventDefault();
			dispatch( pushRoute( to ) );
			onClick();
		}
	}

	function handleOnMouseEnter( event ) {
		// Preserve original handler of rendering parent
		onMouseEnter( event );

		// If preload intent, trigger on mouse over
		if ( preload ) {
			dispatch( preloadRoute( to ) );
		}

		// Set mouseover as state so we can track prop changes and re-trigger
		// preload if the link changes while mouse within
		setIsMouseOver( true );
	}

	function handleOnMouseLeave( event ) {
		// Preserve original handler of rendering parent
		onMouseLeave( event );

		setIsMouseOver( false );
	}

	const classes = classNames( [ 'link', className ] );

	if ( ! isLocalPath() ) {
		assign( additionalProps, {
			target: '_blank',
			rel: uniq(
				compact( [ additionalProps.rel, 'noopener', 'noreferrer' ] )
			).join( ' ' ),
		} );
	}

	// Prefix with site URL if root-relative path
	const href = ( isManagedPath() ? SITE_URL : '' ) + to;

	// ESLint disable reason: The content is provided via spread children props.

	return (
		// eslint-disable-next-line jsx-a11y/anchor-has-content
		<a
			{ ...additionalProps }
			className={ classes }
			href={ href }
			onClick={ handleOnClick }
			onMouseEnter={ handleOnMouseEnter }
			onMouseLeave={ handleOnMouseLeave }
		/>
	);
}

export default Link;
