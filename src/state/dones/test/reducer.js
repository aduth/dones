/**
 * External dependencies
 */
import deepFreeze from 'deep-freeze';

/**
 * Internal dependencies
 */
import {
	DONES_RECEIVE,
	DONE_CREATE,
	DONE_UPDATE,
	DONE_DELETE,
} from 'state/action-types';
import reducer, { items, pages, received, totalPages } from '../reducer';

describe( 'reducer', () => {
	it( 'exports expected keys', () => {
		expect( Object.keys( reducer( undefined, {} ) ) ).toEqual( [
			'items',
			'pages',
			'received',
			'totalPages',
		] );
	} );

	describe( 'items()', () => {
		it( 'defaults to an empty object', () => {
			const state = items( undefined, {} );

			expect( state ).toEqual( {} );
		} );

		it( 'receives dones keyed by id', () => {
			const state = items( undefined, {
				type: DONES_RECEIVE,
				dones: [
					{
						id: 1,
						text: 'done',
						date: '2017-01-01 00:00:00',
						done: true,
						user: 1,
					},
				],
			} );

			expect( state ).toEqual( {
				1: {
					id: 1,
					text: 'done',
					date: '2017-01-01 00:00:00',
					done: true,
					user: 1,
				},
			} );
		} );

		it( 'returns same reference on same received dones', () => {
			const original = deepFreeze( {
				1: {
					id: 1,
					text: 'done',
					date: '2017-01-01 00:00:00',
					done: true,
					user: 1,
				},
			} );
			const state = items( original, {
				type: DONES_RECEIVE,
				dones: [
					{
						id: 1,
						text: 'done',
						date: '2017-01-01 00:00:00',
						done: true,
						user: 1,
					},
				],
			} );

			expect( state ).toBe( state );
		} );

		it( 'returns with a created done', () => {
			const original = deepFreeze( {
				1: {
					id: 1,
					text: 'done',
					date: '2017-01-01 00:00:00',
					done: true,
					user: 1,
				},
			} );
			const state = items( original, {
				type: DONE_CREATE,
				transientId: 'done1',
				text: 'next',
				date: '2017-01-01 00:00:00',
				done: true,
			} );

			expect( state ).toEqual( {
				1: {
					id: 1,
					text: 'done',
					date: '2017-01-01 00:00:00',
					done: true,
					user: 1,
				},
				done1: {
					id: 'done1',
					text: 'next',
					date: '2017-01-01 00:00:00',
					done: true,
					user: 1,
				},
			} );
		} );

		it( 'updates an existing done', () => {
			const original = deepFreeze( {
				1: {
					id: 1,
					text: 'done',
					date: '2017-01-01 00:00:00',
					done: true,
					user: 1,
				},
				done1: {
					id: 'done1',
					text: 'next',
					date: '2017-01-01 00:00:00',
					done: true,
					user: 1,
				},
			} );
			const state = items( original, {
				type: DONE_UPDATE,
				id: 1,
				text: 'done updated',
				date: '2017-01-01 00:00:00',
				done: true,
				user: 1,
			} );

			expect( state ).toEqual( {
				1: {
					id: 1,
					text: 'done updated',
					date: '2017-01-01 00:00:00',
					done: true,
					user: 1,
				},
				done1: {
					id: 'done1',
					text: 'next',
					date: '2017-01-01 00:00:00',
					done: true,
					user: 1,
				},
			} );
		} );

		it( 'returns the same reference if update results in same', () => {
			const original = deepFreeze( {
				1: {
					id: 1,
					text: 'done updated',
					date: '2017-01-01 00:00:00',
					done: true,
					user: 1,
				},
				done1: {
					id: 'done1',
					text: 'next',
					date: '2017-01-01 00:00:00',
					done: true,
					user: 1,
				},
			} );
			const state = items( original, {
				type: DONE_UPDATE,
				id: 1,
				text: 'done updated',
				date: '2017-01-01 00:00:00',
				done: true,
				user: 1,
			} );

			expect( state ).toBe( original );
		} );

		it( 'replaces done', () => {
			const original = deepFreeze( {
				1: {
					id: 1,
					text: 'done updated',
					date: '2017-01-01 00:00:00',
					done: true,
					user: 1,
				},
				done1: {
					id: 'done1',
					text: 'next',
					date: '2017-01-01 00:00:00',
					done: true,
					user: 1,
				},
			} );
			const state = items( original, {
				type: DONE_UPDATE,
				id: 2,
				replaceId: 'done1',
				date: '2017-01-01 00:00:00',
				done: true,
				user: 1,
			} );

			expect( state ).toEqual( {
				1: {
					id: 1,
					text: 'done updated',
					date: '2017-01-01 00:00:00',
					done: true,
					user: 1,
				},
				2: {
					id: 2,
					text: 'next',
					date: '2017-01-01 00:00:00',
					done: true,
					user: 1,
				},
			} );
		} );

		it( 'omits deleted done', () => {
			const original = deepFreeze( {
				1: {
					id: 1,
					text: 'done updated',
					date: '2017-01-01 00:00:00',
					done: true,
					user: 1,
				},
				2: {
					id: 2,
					text: 'next',
					date: '2017-01-01 00:00:00',
					done: true,
					user: 1,
				},
			} );
			const state = items( original, {
				type: DONE_DELETE,
				id: 1,
			} );

			expect( state ).toEqual( {
				2: {
					id: 2,
					text: 'next',
					date: '2017-01-01 00:00:00',
					done: true,
					user: 1,
				},
			} );
		} );
	} );

	describe( 'pages()', () => {
		it( 'defaults to an empty object', () => {
			const state = pages( undefined, {} );

			expect( state ).toEqual( {} );
		} );

		it( 'returns same state when lacking query', () => {
			const original = deepFreeze( {} );
			const state = pages( original, {
				type: 'DONES_RECEIVE',
				dones: [ {
					id: 320,
					user: 1,
					text: 'done',
					date: '2017-05-10 00:00:00',
					done: true,
				} ],
			} );

			expect( state ).toBe( original );
		} );

		it( 'should receive pages for new query, default page 1', () => {
			const original = deepFreeze( {} );
			const state = pages( original, {
				type: 'DONES_RECEIVE',
				dones: [ {
					id: 320,
					user: 1,
					text: 'done',
					date: '2017-05-10 00:00:00',
					done: true,
				} ],
				query: {
					date: '2017-05-10',
				},
			} );

			expect( state ).toEqual( {
				'{"date":"2017-05-10"}': [ [ 320 ] ],
			} );
		} );

		it( 'should receive pages for new query', () => {
			const original = deepFreeze( {} );
			const state = pages( original, {
				type: 'DONES_RECEIVE',
				dones: [ {
					id: 321,
					user: 1,
					text: 'done',
					date: '2017-05-10 00:00:00',
					done: true,
				} ],
				query: {
					date: '2017-05-10',
					page: 2,
				},
			} );

			expect( state ).toEqual( {
				'{"date":"2017-05-10"}': [ , [ 321 ] ],
			} );
		} );

		it( 'should receive pages for known query', () => {
			const original = deepFreeze( {
				'{"date":"2017-05-10"}': [ [ 320 ] ],
			} );
			const state = pages( original, {
				type: 'DONES_RECEIVE',
				dones: [ {
					id: 321,
					user: 1,
					text: 'done',
					date: '2017-05-10 00:00:00',
					done: true,
				} ],
				query: {
					date: '2017-05-10',
					page: 2,
				},
			} );

			expect( state ).toEqual( {
				'{"date":"2017-05-10"}': [ [ 320 ], [ 321 ] ],
			} );
		} );

		it( 'sholud return same reference when pages same', () => {
			const original = deepFreeze( {
				'{"date":"2017-05-10"}': [ [ 320 ], [ 321 ] ],
			} );
			const state = pages( original, {
				type: 'DONES_RECEIVE',
				dones: [ {
					id: 321,
					user: 1,
					text: 'done',
					date: '2017-05-10 00:00:00',
					done: true,
				} ],
				query: {
					date: '2017-05-10',
					page: 2,
				},
			} );

			expect( state ).toBe( original );
		} );
	} );

	describe( 'received()', () => {
		it( 'defaults to an empty object', () => {
			const state = received( undefined, {} );

			expect( state ).toEqual( {} );
		} );

		it( 'returns same state when lacking query', () => {
			const original = deepFreeze( {} );
			const state = received( original, {
				type: DONES_RECEIVE,
			} );

			expect( state ).toBe( original );
		} );

		it( 'should key any received query as value true', () => {
			const original = deepFreeze( {} );
			const state = received( original, {
				type: 'DONES_RECEIVE',
				dones: [ {
					id: 320,
					user: 1,
					text: 'done',
					date: '2017-05-10 00:00:00',
					done: true,
				} ],
				query: {
					date: '2017-05-10',
					page: 1,
				},
			} );

			expect( state ).toEqual( {
				'{"date":"2017-05-10","page":1}': true,
			} );
		} );
	} );

	describe( 'totalPages()', () => {
		it( 'defaults to an empty object', () => {
			const state = totalPages( undefined, {} );

			expect( state ).toEqual( {} );
		} );

		it( 'returns same state when lacking query', () => {
			const original = deepFreeze( {} );
			const state = totalPages( original, {
				type: DONES_RECEIVE,
			} );

			expect( state ).toBe( original );
		} );

		it( 'returns same state when non-numeric total', () => {
			const original = deepFreeze( {} );
			const state = totalPages( original, {
				type: DONES_RECEIVE,
				query: {},
			} );

			expect( state ).toBe( original );
		} );

		it( 'returns total pages for query', () => {
			const original = deepFreeze( {} );
			const state = totalPages( original, {
				type: 'DONES_RECEIVE',
				dones: [ {
					id: 320,
					user: 1,
					text: 'done',
					date: '2017-05-10 00:00:00',
					done: true,
				} ],
				query: {
					date: '2017-05-10',
					page: 1,
				},
				totalPages: 1,
			} );

			expect( state ).toEqual( {
				'{"date":"2017-05-10"}': 1,
			} );
		} );
	} );
} );
