/**
 * External dependencies
 */
import { clone, assign, forEach, partial, isPlainObject, reduce } from 'lodash';

/**
 * Internal dependencies
 */
import { API_ROOT, API_NONCE, PRELOADED_REQUESTS } from 'constant';

export default class Request {
	static initialize() {
		if ( ! this.nonce ) {
			this.nonce = API_NONCE;
		}

		if ( ! this.preload ) {
			this.preload = clone( PRELOADED_REQUESTS );
		}
	}

	static async request( method, path, options ) {
		this.initialize();

		options = assign( {
			method,
			credentials: 'include',
			headers: new Headers()
		}, options );

		if ( 'GET' === options.method && this.preload[ path ] ) {
			const data = this.preload[ path ];
			delete this.preload[ path ];
			return Promise.resolve( data );
		}

		if ( isPlainObject( options.body ) ) {
			options.headers.append( 'Content-Type', 'application/x-www-form-urlencoded' );
			options.body = reduce( options.body, ( memo, value, key ) => {
				return memo.concat( encodeURIComponent( key ) + '=' + encodeURIComponent( value ) );
			}, [] ).join( '&' );
		}

		const url = `${ API_ROOT }${ path }`;
		options.headers.append( 'X-WP-Nonce', this.nonce );
		const response = await fetch( url, options );

		const nextNonce = response.headers.get( 'X-WP-Nonce' );
		if ( nextNonce ) {
			this.nonce = nextNonce;
		}

		return await response.json();
	}
}

forEach( [ 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD' ], ( method ) => {
	Request[ method.toLowerCase() ] = partial( Request.request, method );
} );
