/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import callbackify from '../';

describe( 'callbackify', () => {
	it( 'resolves callback with success', ( done ) => {
		callbackify( Promise.resolve( 'success' ), ( error, result ) => {
			expect( error ).to.be.null;
			expect( result ).to.equal( 'success' );

			done();
		} );
	} );

	it( 'resolves callback with error', ( done ) => {
		callbackify( Promise.reject( 'failure' ), ( error, result ) => {
			expect( error ).to.equal( 'failure' );
			expect( result ).to.be.undefined;

			done();
		} );
	} );
} );
