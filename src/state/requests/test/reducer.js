/**
 * External dependencies
 */
import { expect } from 'chai';
import deepFreeze from 'deep-freeze';

/**
 * Internal dependencies
 */
import {
	REQUEST_COMPLETE,
	REQUEST_NONCE_SET,
	REQUEST_PATH_REQUEST_SET,
	REQUEST_PRELOAD_CLEAR,
	REQUEST_PRELOAD_SET,
} from 'state/action-types';
import reducer, { items, preload, nonce } from '../reducer';

describe( 'reducer', () => {
	it( 'returns with expected keys', () => {
		const state = reducer( undefined, {} );

		expect( state ).to.have.keys( [
			'items',
			'preloading',
			'preload',
			'nonce',
			'isCapturingPreload',
		] );
	} );

	describe( 'items()', () => {
		it( 'returns an empty object by default', () => {
			const state = items( undefined, {} );

			expect( state ).to.eql( {} );
		} );

		it( 'sets request path by method', () => {
			const originalState = deepFreeze( {} );
			const state = items( originalState, {
				type: REQUEST_PATH_REQUEST_SET,
				path: '/foo',
				request: {},
			} );

			expect( state ).to.eql( {
				'/foo': {
					GET: {},
				},
			} );
		} );

		it( 'sets accumulates path by method', () => {
			const originalState = deepFreeze( {
				'/foo': {
					GET: {},
				},
			} );
			const state = items( originalState, {
				type: REQUEST_PATH_REQUEST_SET,
				path: '/foo',
				params: {
					method: 'POST',
				},
				request: {},
			} );

			expect( state ).to.eql( {
				'/foo': {
					GET: {},
					POST: {},
				},
			} );
		} );

		it( 'omits completed path method', () => {
			const originalState = deepFreeze( {
				'/foo': {
					GET: {},
					POST: {},
				},
			} );
			const state = items( originalState, {
				type: REQUEST_COMPLETE,
				path: '/foo',
			} );

			expect( state ).to.eql( {
				'/foo': {
					POST: {},
				},
			} );
		} );

		it( 'omits completed path', () => {
			const originalState = deepFreeze( {
				'/foo': {
					POST: {},
				},
			} );
			const state = items( originalState, {
				type: REQUEST_COMPLETE,
				path: '/foo',
				params: {
					method: 'POST',
				},
			} );

			expect( state ).to.eql( {} );
		} );
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
				id: '1',
				responses: {
					'/dones/v1/users': {
						body: {
							avatar: 'https://example.com/avatar.png',
							id: 1,
							name: 'Andrew Duthie',
						},
						headers: {
							'X-Wp-NoNCe': '1ab98c39ab',
						},
					},
				},
			} );

			expect( state ).to.eql( {
				'/dones/v1/users': [ {
					body: {
						avatar: 'https://example.com/avatar.png',
						id: 1,
						name: 'Andrew Duthie',
					},
					headers: {
						'x-wp-nonce': '1ab98c39ab',
					},
				}, '1' ],
			} );
		} );

		it( 'returns same state if preload cleared with mismatched id', () => {
			const original = deepFreeze( {
				'/dones/v1/users': [ {
					body: {
						avatar: 'https://example.com/avatar.png',
						id: 1,
						name: 'Andrew Duthie',
					},
					headers: {
						'x-wp-nonce': '1ab98c39ab',
					},
				}, '1' ],
			} );
			const state = preload( original, {
				type: REQUEST_PRELOAD_CLEAR,
				id: '2',
			} );

			expect( state ).to.equal( original );
		} );

		it( 'returns an object with responses of matching id removed', () => {
			const original = deepFreeze( {
				'/dones/v1/users': [ {
					body: {
						avatar: 'https://example.com/avatar.png',
						id: 1,
						name: 'Andrew Duthie',
					},
					headers: {
						'x-wp-nonce': '1ab98c39ab',
					},
				}, '1' ],
			} );
			const state = preload( original, {
				type: REQUEST_PRELOAD_CLEAR,
				id: '1',
			} );

			expect( state ).to.eql( {} );
		} );

		it( 'returns same state if preload single path cleared with mismatched id', () => {
			const original = deepFreeze( {
				'/dones/v1/users': [ {
					body: {
						avatar: 'https://example.com/avatar.png',
						id: 1,
						name: 'Andrew Duthie',
					},
					headers: {
						'x-wp-nonce': '1ab98c39ab',
					},
				}, '3' ],
			} );
			const state = preload( original, {
				type: REQUEST_PRELOAD_CLEAR,
				path: '/dones/v1/users',
				id: '4',
			} );

			expect( state ).to.equal( original );
		} );

		it( 'returns an object without matched id for single path cleared', () => {
			const original = deepFreeze( {
				'/dones/v1/users': [ {
					body: {
						avatar: 'https://example.com/avatar.png',
						id: 1,
						name: 'Andrew Duthie',
					},
					headers: {
						'x-wp-nonce': '1ab98c39ab',
					},
				}, '3' ],
			} );
			const state = preload( original, {
				type: REQUEST_PRELOAD_CLEAR,
				path: '/dones/v1/users',
				id: '3',
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
				nonce: '1ab98c39ab',
			} );

			expect( state ).to.equal( '1ab98c39ab' );
		} );

		it( 'guards against an undefined action nonce', () => {
			const state = nonce( undefined, {
				type: REQUEST_NONCE_SET,
				nonce: undefined,
			} );

			expect( state ).to.be.null;
		} );
	} );
} );
