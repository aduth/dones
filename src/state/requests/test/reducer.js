/**
 * External dependencies
 */
import { expect } from 'chai';
import deepFreeze from 'deep-freeze';

/**
 * Internal dependencies
 */
import {
	REQUEST_PRELOAD_CLEAR,
	REQUEST_PRELOAD_SET
} from 'state/action-types';
import { preload } from '../reducer';

describe( 'reducer', () => {
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
} );
