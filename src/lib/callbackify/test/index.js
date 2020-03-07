/**
 * External dependencies
 */

/**
 * Internal dependencies
 */
import callbackify from '../';

describe( 'callbackify', () => {
	it( 'resolves callback with success', ( done ) => {
		callbackify( Promise.resolve( 'success' ), ( error, result ) => {
			expect( error ).toBe( null );
			expect( result ).toBe( 'success' );

			done();
		} );
	} );

	it( 'resolves callback with error', ( done ) => {
		callbackify( Promise.reject( 'failure' ), ( error, result ) => {
			expect( error ).toBe( 'failure' );
			expect( result ).toBeUndefined();

			done();
		} );
	} );
} );
