/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import getPreloadedResponse from '../get-preloaded-response';

describe( 'getPreloadedResponse()', () => {
	it( 'should return null if path is not preloaded', () => {
		const response = getPreloadedResponse( {
			requests: {
				preload: {},
			},
		}, '/dones/v1/users' );

		expect( response ).toBe( null );
	} );

	it( 'should return preloaded response payload', () => {
		const payload = {
			body: [
				{
					id: 1,
					name: 'Andrew Duthie',
					avatar: 'https://example.com/avatar.png',
				},
			],
			headers: [],
		};

		const response = getPreloadedResponse( {
			requests: {
				preload: {
					'/dones/v1/users': [ payload, '1' ],
				},
			},
		}, '/dones/v1/users' );

		expect( response ).toBe( payload );
	} );
} );
