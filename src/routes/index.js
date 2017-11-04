/**
 * External dependencies
 */
import wayfarer from 'wayfarer';
import memoize from 'memize';

/**
 * Internal dependencies
 */
import HomeRoute from './home';
import DateRoute from './date';
import TagsRoute from './tags';
import TagRoute from './tag';
import NotFoundRoute from './not-found';

const withParams = ( Route ) => ( params ) => ( { params, Route } );

const router = wayfarer();
router.on( '/', withParams( HomeRoute ) );
router.on( '/date/:date', withParams( DateRoute ) );
router.on( '/tags/:tag/page/:page', withParams( TagRoute ) );
router.on( '/tags/:tag', withParams( TagRoute ) );
router.on( '/tags', withParams( TagsRoute ) );
router.on( '*', withParams( NotFoundRoute ) );

export const getRouteByPath = memoize( ( path ) => {
	// Strip query parameters, hash, trailing slash
	path = path.replace( /\/?[\?|#].*$/g, '' );

	return router( path.replace( /\/$/, '' ) );
} );
