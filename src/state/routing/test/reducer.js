/**
 * External dependencies
 */
import { expect } from 'chai';

/**
 * Internal dependencies
 */
import { ROUTE_PUSH, ROUTE_REPLACE } from 'state/action-types';
import reducer, { path, isInitial } from '../reducer';

describe( 'reducer', () => {
	it( 'returns with expected keys', () => {
		const state = reducer( undefined, {} );

		expect( state ).to.have.keys( [
			'path',
			'isInitial',
		] );
	} );

	describe( 'path()', () => {
		it( 'defaults to null', () => {
			const state = path( undefined, {} );

			expect( state ).to.be.null;
		} );

		it( 'returns the next path on replace', () => {
			const state = path( null, {
				type: ROUTE_REPLACE,
				path: '/foo',
			} );

			expect( state ).to.equal( '/foo' );
		} );

		it( 'returns the next path on push', () => {
			const state = path( '/foo', {
				type: ROUTE_PUSH,
				path: '/bar',
			} );

			expect( state ).to.equal( '/bar' );
		} );
	} );

	describe( 'isInitial()', () => {
		it( 'defaults to true', () => {
			const state = isInitial( undefined, {} );

			expect( state ).to.be.true;
		} );

		it( 'returns false on push', () => {
			const state = isInitial( true, {
				type: ROUTE_PUSH,
			} );

			expect( state ).to.be.false;
		} );

		it( 'returns true on replace', () => {
			const state = isInitial( false, {
				type: ROUTE_REPLACE,
			} );

			expect( state ).to.be.true;
		} );
	} );
} );
