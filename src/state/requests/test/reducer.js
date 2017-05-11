/**
 * External dependencies
 */
import { expect } from 'chai';
import deepFreeze from 'deep-freeze';

/**
 * Internal dependencies
 */
import {
	REQUEST_NONCE_SET,
	REQUEST_PRELOAD_CLEAR,
	REQUEST_PRELOAD_SET
} from 'state/action-types';
import reducer, { preload, nonce } from '../reducer';

describe( 'reducer', () => {
	it( 'returns with expected keys', () => {
		const state = reducer( undefined, {} );

		expect( state ).to.have.keys( [
			'items',
			'preload',
			'nonce'
		] );
	} );

	describe( 'preload()', () => {
		it( 'returns an empty object by default', () => {
			const state = preload( undefined, {} );

			expect( state ).to.eql( {} );
		} );

		it( 'returns object of response data with lowercase headers keys', () => {
			const original = deepFreeze( {} );
			const state = preload( original, {
				type: REQUEST_PRELOAD_SET,
				responses: {
					'/dones/v1/users': {
						body: {
							avatar: 'https://example.com/avatar.png',
							id: 1,
							name: 'Andrew Duthie'
						},
						headers: {
							'X-Wp-NoNCe': '1ab98c39ab'
						}
					}
				}
			} );

			expect( state ).to.eql( {
				'/dones/v1/users': {
					body: {
						avatar: 'https://example.com/avatar.png',
						id: 1,
						name: 'Andrew Duthie'
					},
					headers: {
						'x-wp-nonce': '1ab98c39ab'
					}
				}
			} );
		} );

		it( 'returns an empty object when preload cleared', () => {
			const original = deepFreeze( {
				'/dones/v1/users': {
					body: {
						avatar: 'https://example.com/avatar.png',
						id: 1,
						name: 'Andrew Duthie'
					},
					headers: {
						'x-wp-nonce': '1ab98c39ab'
					}
				}
			} );
			const state = preload( original, {
				type: REQUEST_PRELOAD_CLEAR
			} );

			expect( state ).to.eql( {} );
		} );
	} );

	describe( 'nonce', () => {
		it( 'returns null by default', () => {
			const state = nonce( undefined, {} );

			expect( state ).to.be.null;
		} );

		it( 'returns with the action nonce', () => {
			const state = nonce( undefined, {
				type: REQUEST_NONCE_SET,
				nonce: '1ab98c39ab'
			} );

			expect( state ).to.equal( '1ab98c39ab' );
		} );

		it( 'guards against an undefined action nonce', () => {
			const state = nonce( undefined, {
				type: REQUEST_NONCE_SET,
				nonce: undefined
			} );

			expect( state ).to.be.null;
		} );
	} );
} );
