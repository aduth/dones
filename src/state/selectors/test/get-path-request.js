/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import getPathRequest from '../get-path-request';

describe( 'getPathRequest()', () => {
	it( 'returns null if no request', () => {
		const request = getPathRequest( {
			requests: {
				items: {},
			},
		}, '/foo' );

		expect( request ).toBe( null );
	} );

	it( 'returns GET request', () => {
		const request = getPathRequest( {
			requests: {
				items: {
					'/foo': {
						GET: { get: true },
						POST: { post: true },
					},
				},
			},
		}, '/foo' );

		expect( request ).toEqual( { get: true } );
	} );

	it( 'returns request by method', () => {
		const request = getPathRequest( {
			requests: {
				items: {
					'/foo': {
						GET: { get: true },
						POST: { post: true },
					},
				},
			},
		}, '/foo', 'POST' );

		expect( request ).toEqual( { post: true } );
	} );
} );
